const { Pool, types } = require('pg');
const config = require('./config.json')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennkey with your own
  const name = 'John Doe';
  const pennkey = 'jdoe';

  // checks the value of type in the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.json({ name: name });
  } else if (null) {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
  } else {
    res.status(400).json({});
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RANDOM()
    LIMIT 1
  `, (err, data) => {
    if (err) {
      // If there is an error for some reason, print the error message and
      // return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data.rows[0])
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data.rows[0].song_id,
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data.rows[0]
  // Most of the code is already written for you, you just need to fill in the query
  connection.query(``, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  res.json({}); // replace this with your implementation
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  res.json([]); // replace this with your implementation
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  res.json([]); // replace this with your implementation
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = undefined;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    res.json([]); // replace this with your implementation
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    res.json([]); // replace this with your implementation
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  res.json([]); // replace this with your implementation
}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;

  res.json([]); // replace this with your implementation
}


// Bowen Xiang: Movie main page
// Bowen Xiang: Movie main page
const getMovies = async function(req, res) {
  try {
      // Parse query parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 16;
      const filter = req.query.filter || 'name_asc';

      // Validate page and pageSize
      if (page < 1 || pageSize < 1) {
          return res.status(400).json({
              error: 'Page and pageSize must be positive integers'
          });
      }

      // Validate filter
      const validFilters = ['name_asc', 'name_desc', 'rating_asc', 'rating_desc'];
      if (!validFilters.includes(filter)) {
          return res.status(400).json({
              error: 'Invalid filter value'
          });
      }

      // Calculate offset
      const offset = (page - 1) * pageSize;

      // Determine order clause based on filter
      let orderClause;
      switch(filter) {
          case 'name_asc':
              orderClause = 'title ASC';
              break;
          case 'name_desc':
              orderClause = 'title DESC';
              break;
          case 'rating_asc':
              orderClause = 'vote_average ASC';
              break;
          case 'rating_desc':
              orderClause = 'vote_average DESC';
              break;
          default:
              orderClause = 'title ASC';
      }

      // Fixed query with proper type casting for popularity
      const queryText = `
          SELECT 
              id,
              COALESCE(poster_path, '') as image,
              title as name,
              ROUND(CAST(popularity as numeric), 3) as popularity
          FROM movie_details
          WHERE 
              title ~ '^[A-Za-z0-9]'  -- Start with alphanumeric character
              AND CAST(popularity AS numeric) > 0.5     -- Fixed: Cast popularity to numeric
              AND title != ''          -- Exclude empty titles
          ORDER BY 
              CASE WHEN poster_path IS NULL THEN 1 ELSE 0 END,  -- Movies with images first
              ${orderClause}
          LIMIT $1 OFFSET $2
      `;

      // Updated count query with proper type casting
      const countText = `
          SELECT COUNT(*) 
          FROM movie_details
          WHERE 
              title ~ '^[A-Za-z0-9]'
              AND CAST(popularity AS numeric) > 0.5
              AND title != ''
      `;

      // Execute both queries using the existing connection
      const [moviesResult, countResult] = await Promise.all([
          connection.query(queryText, [pageSize, offset]),
          connection.query(countText)
      ]);

      // Calculate pagination values
      const totalItems = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalItems / pageSize);

      // Prepare and send response
      const response = {
          results: moviesResult.rows,
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems
      };

      res.json(response);

  } catch (err) {
      console.error('Error in /movies endpoint:', err);
      res.status(500).json({
          error: 'Internal server error',
          details: err.message
      });
  }
}



module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
  getMovies,  // Bowen Xiang added on Nov 27
}
