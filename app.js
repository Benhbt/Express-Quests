require("dotenv").config();
const express = require("express");


const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 3000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const { validateMovie } = require("./validator.js");
const { validateUser } = require("./validator.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/movies",verifyToken, validateMovie, movieHandlers.postMovie);

app.put("/api/movies/:id",verifyToken, validateMovie, movieHandlers.updateMovie);

app.delete("/api/movies/:id",verifyToken, movieHandlers.deleteMovie);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post("/api/users", hashPassword,validateUser, userHandlers.postUser);

app.put("/api/users/:id",verifyToken, hashPassword,validateUser, userHandlers.updateUser);

app.delete("/api/users/:id",verifyToken, userHandlers.deleteUser);


const isItDwight = (req, res) => {
  if (req.body.email === "ben@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});


