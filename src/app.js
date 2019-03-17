const express = require('express');
const bodyParser = require('body-parser');

const appRoutes = require('./app-routes');
const Prometheus = require('./shared/utils/prometheus');
const { errorHandler } = require('./shared/utils/');

const port = process.env.PORT || 3000;

// creating the express app
const app = express();

/***** Configuring the application *****/
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// registering the app routes
app.use(appRoutes);

/**
 * The below arguments start the counter functions
 */
app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();

// Error handler
app.use(errorHandler);

/***** App configuration ends *****/
const bootstrapApp = app => {
  app.listen(port, () => {
    console.log(`App running on port: ${port}`);
  });
};

bootstrapApp(app);
