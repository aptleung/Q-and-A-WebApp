// Import Dependecies
// requires -> loads the librarys installed with NPM

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Defining Express App

const app = express();

// Defining the Array Acting as the Database

const questions = [];

//use() -> express app method used to configure the libraries
// Enhancing App security with Helmet
// Helmet: Library that helps secure Express apps with various HTTP headers
app.use(helmet());

//BodyParser to parse application/JSON content
app.use(bodyParser.json());

//Library to configure express to add headers stating API accepts request from other origins
app.use(cors());

//Library that adds logging capabilities to Express App
app.use(morgan("combined"));

// app.get('/', ...) -> responsbile for sending the list of questions back to whoever
// requested it
//Retrieving all questions
app.get("/", (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length
  }));
  res.send(qs);
});

// Uses GET HHTP request
// Getting a specific question
// No checkJwt here b/c we want GET to be publicly available. (ie. everyone can view questions and answers)
app.get("/:id", (req, res) => {
  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();
  res.send(question[0]);
});

// Express middleware that will validate ID Tokens
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestPerMinute: 5,
    jwksUri: `https://dev-oc1e9m8w.auth0.com/.well-known/jwks.json`
  }),
  // Validate audience and issuer
  audience: "BN7hhV8FuU8yJD24aHyicbVQiiXP31Bl",
  issuer: `https://dev-oc1e9m8w.auth0.com/`,
  algorithms: ["RS256"]
});

// Activated when someone sends POST HTTP request. Takes message send in body of request to insert
// a newQuestion
// Adding a new question
// checkJwt -> makes it unavailable to unauthenticated users
app.post("/", checkJwt, (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: [],
    author: req.user.name
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// ID route parameter to identify the specific question to answer
// Answer a question
app.post("/answer/:id", checkJwt, (req, res) => {
  const { answer } = req.body;

  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer,
    author: req.user.name
  });

  res.status(200).send();
});

// Listen() -> runs Express App backend
// Starting the server
app.listen(8081, () => {
  console.log("listening on port 8081");
});
