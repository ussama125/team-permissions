const express = require("express");
var bodyParser = require('body-parser')
const app = express();
require("dotenv").config();
var projectRoutes = require('./routes/project');
var permissionRoutes = require('./routes/permission');
var cors = require('cors');
const { createTenant, writeSchema, writeRelationships } = require("./permify.setup");
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});

app.use(bodyParser.json())

app.use('/project', projectRoutes);
app.use('/permission', permissionRoutes);

app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await createTenant();
  await writeSchema();
  await writeRelationships();
});