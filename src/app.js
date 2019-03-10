const express = require('express');
const bodyParser = require('body-parser');

const appRoutes = require('./app-routes');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(appRoutes);

const bootstrapApp = app => {
  app.listen(port, () => {
    console.log(`App running on port: ${port}`);
  });
};

bootstrapApp(app);

// const express = require("express");
// const bodyParser = require("body-parser");

// const { errorHandler } = require("./shared/utils");
// const appRoutes = require("./app-routes");

// const port = process.env.PORT || 3000;

// // creating the express app
// const app = express();

// /***** Configuring the application *****/

// // Body-parser
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// );

// // registering the app routes
// app.use(appRoutes);

// // register error handler
// app.use(errorHandler);

// /***** App configuration ends *****/

// const bootstrapApp = app => {
//   app.listen(port, () => {
//     console.log(`App working on ${port}`);
//   });
// };

// bootstrapApp(app);
