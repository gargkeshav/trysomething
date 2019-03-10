const { getPRState } = require('../services');

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
    res.status(e.status ? e.status : 500).send(e.body);
  }
  res.status(200).send(results);
  next();
};

module.exports = listPR;
