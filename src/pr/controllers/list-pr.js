const axios = require('axios');

const maxPerPage = process.env.MAX_PER_PAGE || 100;
const defaultRepo = 'twbs/bootstrap';
const searchApiEndpoint = 'https://api.github.com/search/issues';
const pullApiEndpoint = 'https://api.github.com/repos/#REPO_NAME/pulls';

const mergePendingState = 'MERGE_PENDING';
const mergePendingQuery = 'q=is:pr+state:open+status:success+review:approved';

const statusFailingState = 'FAILING';
const statusFailingQuery = 'q=is:pr+state:open+status:failure';

const statusPendingState = 'STATUS_CHECK_PENDING';
const statusPendingQuery = 'q=is:pr+state:open+status:pending+review:approved';

const reviewPendingState = 'REVIEWER_PENDING';
const reviewPendingQuery = 'q=is:pr+state:open+review:none';

const reviewInProgressState = 'REVIEW_IN_PROGRESS';
const getAllOpenPRQuery = 'state=open';

let listPRRes = require('./list-pr-response');

const listPR = async (req, res, next) => {
    try{
    let authorization = req.headers.authorization ? req.headers.authorization : null;
    let repo = req.query.repo ? req.query.repo :defaultRepo;
      console.log(`${authorization}        ${repo}`);
      let results = await getPRState(repo, authorization);
    } catch (e) {
      res.status(e.status? e.status : 500).send(e.body);
    }
      res.status(200).send(results);
      next();
};

const getPRState = async (repo = defaultRepo, authorization = null) => {

    let [
        mergePendingPR, 
        statusFailingPR, 
        statusPendingPR, 
        reviewPendingPR, 
        reviewerAssignedPR
        ] =
          await Promise.all([
            getMergePendingPR(repo, authorization),
            getStatusFailingPR(repo, authorization),
            getStatusPendingPR(repo, authorization),
            getReviewPendingPR(repo, authorization),
            getReviewerAssignedPR(repo, authorization)
          ]);

    // let results = [];
    // let results1 = await getMergePendingPR(repo, authorization);
    // let results2 = await getStatusFailingPR(repo, authorization);
    // let results3 = await getStatusPendingPR(repo, authorization);
    // let results4 = await getReviewPendingPR(repo, authorization);
    // let results5 = await getReviewerAssignedPR(repo, authorization);
  
    let inReviewPR = mapReviewerAssignedPR(reviewPendingPR, reviewerAssignedPR);
    listPRRes.prs = [...mergePendingPR, ...statusFailingPR, ...statusPendingPR, ...inReviewPR];
    listPRRes.prs.sort((a, b) => a.id - b.id);
    return listPRRes;
  };

  const getMergePendingPR = async (repo, authorization) => {
    query = `${mergePendingQuery}+repo:${repo}`;
    let results = await scrapSearchApi(query, authorization);
    return results = mapState(results, mergePendingState);
  };
  
  const getStatusFailingPR = async (repo, authorization) => {
    query = `${statusFailingQuery}+repo:${repo}`;
    let results = await scrapSearchApi(query, authorization);
    return results = mapState(results, statusFailingState);
  };
  
  const getStatusPendingPR = async (repo, authorization) => {
    query = `${statusPendingQuery}+repo:${repo}`;
    let results = await scrapSearchApi(query, authorization);
    return results = mapState(results, statusPendingState);
  };
  
  const getReviewPendingPR = async (repo, authorization) => {
    query = `${reviewPendingQuery}+repo:${repo}`;
    let results = await scrapSearchApi(query, authorization);
    return results = mapState(results, reviewPendingState);
  };
  
  const getReviewerAssignedPR = async (repo, authorization) => {
    let query = getAllOpenPRQuery;
    let endpoint = pullApiEndpoint.replace('#REPO_NAME', repo);
    let results = await scrapPullApi(query, authorization, endpoint);
    return results = filterReviewInProgress(results); 
  };

  const mapState = (arr, state) => {
    var filteredArr = arr.map(obj => {
      let tmpObj = {};
      tmpObj.id = obj['number'];
      tmpObj.title= obj['title'];
      tmpObj.state = state;
      return tmpObj;
    });
    return filteredArr;
  };
  
  const mapReviewerAssignedPR = (reviewPendingPR, reviewerAssignedPR) => {
    return reviewPendingPR.map(obj => {
        if(reviewerAssignedPR.indexOf(obj.id)>=0) obj.state = reviewInProgressState;
        return obj;
    })
  };

  const scrapSearchApi = async (queryString, authorization, apiEndpoint = searchApiEndpoint) => {
    let requestUrl = `${apiEndpoint}?${queryString}&per_page=${maxPerPage}`;
    let results= [];
    let page = 1;
  
    while(true) {
      let response = await makeGetCall(`${requestUrl}&page=${page}`, authorization);
      if (!Array.isArray(response.data.items) || response.data.incomplete_results === true)  {
        return new Error('Invalid response from upstream server.', 500);
      }
      if(response.data.items.length >0) {
        [].push.apply(results, response.data.items);
        if(response.data.items.length >= maxPerPage) {
          page++;
          continue;
        }
      } 
      return results;
    }
  };
  
  const scrapPullApi = async (queryString = 'state=open', authorization, apiEndpoint = pullApiEndpoint) => {
    let requestUrl = `${apiEndpoint}?${queryString}&per_page=${maxPerPage}`;
    let results= [];
    let page = 1;
  
    while(true) {
      let response = await makeGetCall(`${requestUrl}&page=${page}`, authorization);
      if (!Array.isArray(response.data))  {
        return new Error('Invalid response from upstream server.', 500);
      }
      if(response.data.length >0) {
        [].push.apply(results, response.data);
        if(response.data.length >= maxPerPage) {
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
        "authorization": authorization,
        "user-agent": "someUserAgent"
      }
     };
  
    return await axios(reqObj);
    };    
  
  const filterReviewInProgress = (arr) => {
    return arr.filter(obj => 
                (obj.requested_reviewers.length >0 || obj.requested_teams.length >0)
                )
              .map(obj => obj.number); 
              
    // var filteredArr = arr.map(obj => {
    //   let tmpObj = {};
    //   tmpObj.id = obj['number'];
    //   tmpObj.title = obj['title'];
    //   tmpObj.state = (obj.requested_reviewers.length >0 || obj.requested_teams.length >0) ? reviewInProgressState:reviewPendingState;
    //   return tmpObj;
    // })
    //   .filter(obj => obj.state === reviewInProgressState ? obj : null);
    // return filteredArr;
  };
  

  module.exports = listPR;