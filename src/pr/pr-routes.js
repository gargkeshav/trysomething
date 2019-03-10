const { Router } = require('express');
const { listPR } = require('./controllers');

const router = Router();


router.get('/api/v1/pr', listPR);

module.exports = router;