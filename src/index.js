const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("../src/app/controllers/authController")(app);
require("../src/app/controllers/projectController")(app);

app.listen(3000);
