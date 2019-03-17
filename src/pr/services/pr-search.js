const axios = require('axios');

const {
  defaultRepo,
  getAllOpenPRQuery,
  mergePendingQuery,
  mergePendingState,
  pullApiEndpoint,
  reviewInProgressState,
  reviewPendingQuery,
  reviewPendingState,
  searchApiEndpoint,
  statusFailingQuery,
  statusFailingState,
  statusPendingQuery,
  statusPendingState
} = require('../config');

const maxPerPage = process.env.MAX_PER_PAGE || 100;

let listPRRes = {
  prs: []
};

const getPRState = async (repo = defaultRepo, authorization = null) => {
  let [
    mergePendingPR,
    statusFailingPR,
    statusPendingPR,
    reviewPendingPR,
    reviewerAssignedPR
  ] = await Promise.all([
    getMergePendingPR(repo, authorization),
    getStatusFailingPR(repo, authorization),
    getStatusPendingPR(repo, authorization),
    getReviewPendingPR(repo, authorization),
    getReviewerAssignedPR(repo, authorization)
  ]);

  let inReviewPR = mapReviewerAssignedPR(reviewPendingPR, reviewerAssignedPR);

  listPRRes.prs = [
    ...mergePendingPR,
    ...statusFailingPR,
    ...statusPendingPR,
    ...inReviewPR
  ];
  listPRRes.prs.sort((a, b) => a.id - b.id);
  return listPRRes;
};

const getMergePendingPR = async (repo, authorization) => {
  query = `${mergePendingQuery}+repo:${repo}`;
  let results = await scrapSearchApi(query, authorization);
  return (results = mapState(results, mergePendingState));
};

const getStatusFailingPR = async (repo, authorization) => {
  query = `${statusFailingQuery}+repo:${repo}`;
  let results = await scrapSearchApi(query, authorization);
  return (results = mapState(results, statusFailingState));
};

const getStatusPendingPR = async (repo, authorization) => {
  query = `${statusPendingQuery}+repo:${repo}`;
  let results = await scrapSearchApi(query, authorization);
  return (results = mapState(results, statusPendingState));
};

const getReviewPendingPR = async (repo, authorization) => {
  query = `${reviewPendingQuery}+repo:${repo}`;
  let results = await scrapSearchApi(query, authorization);
  return (results = mapState(results, reviewPendingState));
};

const getReviewerAssignedPR = async (repo, authorization) => {
  let query = getAllOpenPRQuery;
  let endpoint = pullApiEndpoint.replace('#REPO_NAME', repo);
  let results = await scrapPullApi(query, authorization, endpoint);
  return (results = filterReviewInProgress(results));
};

const mapState = (arr, state) => {
  var filteredArr = arr.map(obj => {
    let tmpObj = {};
    tmpObj.id = obj['number'];
    tmpObj.title = obj['title'];
    tmpObj.state = state;
    return tmpObj;
  });
  return filteredArr;
};

const mapReviewerAssignedPR = (reviewPendingPR, reviewerAssignedPR) => {
  return reviewPendingPR.map(obj => {
    if (reviewerAssignedPR.indexOf(obj.id) >= 0)
      obj.state = reviewInProgressState;
    return obj;
  });
};

const scrapSearchApi = async (
  queryString,
  authorization,
  apiEndpoint = searchApiEndpoint
) => {
  let requestUrl = `${apiEndpoint}?${queryString}&per_page=${maxPerPage}`;
  let results = [];
  let page = 1;

  while (true) {
    let response = await makeGetCall(
      `${requestUrl}&page=${page}`,
      authorization
    );
    if (
      !Array.isArray(response.data.items) ||
      response.data.incomplete_results === true
    ) {
      return new Error('Invalid response from upstream server.', 500);
    }
    if (response.data.items.length > 0) {
      [].push.apply(results, response.data.items);
      if (response.data.items.length >= maxPerPage) {
        page++;
        continue;
      }
    }
    return results;
  }
};

const scrapPullApi = async (
  queryString = 'state=open',
  authorization,
  apiEndpoint = pullApiEndpoint
) => {
  let requestUrl = `${apiEndpoint}?${queryString}&per_page=${maxPerPage}`;
  let results = [];
  let page = 1;

  while (true) {
    let response = await makeGetCall(
      `${requestUrl}&page=${page}`,
      authorization
    );
    if (!Array.isArray(response.data)) {
      return new Error('Invalid response from upstream server.', 500);
    }
    if (response.data.length > 0) {
      [].push.apply(results, response.data);
      if (response.data.length >= maxPerPage) {
        page++;
        continue;
      }
    }
    return results;
  }
};

const makeGetCall = async (requestUrl, authorization) => {
  let reqObj = {
    url: requestUrl,
    json: true,
    headers: {
      authorization: authorization,
      'user-agent': 'someUserAgent'
    }
  };

  return await axios(reqObj);
};

const filterReviewInProgress = arr => {
  return arr
    .filter(
      obj =>
        obj.requested_reviewers.length > 0 || obj.requested_teams.length > 0
    )
    .map(obj => obj.number);
};

module.exports = {
  getPRState,
  filterReviewInProgress,
  makeGetCall,
  scrapPullApi,
  scrapSearchApi
};
