require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/api/movies', routes.getMovies); // added by Bowen Xiang on Nov 27

// Middleware
app.use(cors());
app.use(express.json());

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

// Start the server
app.listen(config.server_port, () => {
  console.log(`Server is running on http://${config.server_host}:${config.server_port}/`);
});
