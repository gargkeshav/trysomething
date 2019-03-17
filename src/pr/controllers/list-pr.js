const { getPRState } = require('../services');
const { defaultRepo } = require('../config');

const listPR = async (req, res, next) => {
  let results;
  try {
    let authorization = req.headers.authorization
      ? req.headers.authorization
      : null;
    let repo = req.query.repo ? req.query.repo : defaultRepo;
    console.log(`${authorization}        ${repo}`);
    results = await getPRState(repo, authorization);
  } catch (e) {
    next(e);
  }
  res.status(200).send(results);
  next();
};

module.exports = listPR;
