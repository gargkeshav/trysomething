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

module.exports = {
  defaultRepo,
  searchApiEndpoint,
  pullApiEndpoint,
  mergePendingState,
  mergePendingQuery,
  statusFailingState,
  statusFailingQuery,
  statusPendingState,
  statusPendingQuery,
  reviewPendingState,
  reviewPendingQuery,
  reviewInProgressState,
  getAllOpenPRQuery
};
