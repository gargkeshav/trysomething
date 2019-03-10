const { Router } = require('express');
const { prRoutes } = require('./pr');

const router = Router();

router.use(prRoutes);

module.exports = router;
