require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/api/movies', routes.getMovies); // added by Bowen Xiang on Nov 27

// Route to get top 10 directors
app.get('/api/top-directors', routes.topDirectors);

// Route to get top 10 male actors
app.get('/api/top-actors', routes.topActors);

// Route to get top 10 female actors
app.get('/api/top-actresses', routes.topActresses);

// Route to get top actor-director combos
app.get('/api/top-combos', routes.topCombos);

// Route to get person details
app.get('/api/persons', routes.getPersons);

// Route to get random pic
app.get('/api/random', routes.getRandom);

// Route to get movie info
app.get('/api/movies/:movie_id', routes.getMovieInfo);

// Route to get movie casts
app.get('/api/movie-casts/:movie_id', routes.getMovieCasts);

// Route to get movie genres
app.get('/api/movie-genres/:movie_id', routes.getMovieGenres);

// Route to get similar movies
app.get('/api/similar-movies/:movie_id', routes.getSimilarMovies);

// Route to get person info
app.get('/api/persons/:person_id', routes.getPersonInfo);

// Route to get person genres
app.get('/api/person-genres/:person_id', routes.getPersonGenres);

// Route to get person genres
app.get('/api/person-known-for/:person_id', routes.getPersonKnownFor);

// Route to get person genres
app.get('/api/person-collaborators/:person_id', routes.getPersonCollaborators);

// Route to get live search results
app.get('/api/search-persons', routes.searchPersons);

// Start the server
app.listen(config.server_port, () => {
  console.log(`Server is running on http://${config.server_host}:${config.server_port}/`);
});
