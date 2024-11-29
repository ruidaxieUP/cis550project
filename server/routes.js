const { Pool, types } = require('pg');
const config = require('./config.json')

const picture_url = "https://image.tmdb.org/t/p/"
const picture_size = "w500"
const default_picture = "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png"

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

// Route 1: GET /api/top-directors
const top_directors = async function(req, res) {
  query = `
    SELECT name, profile_path
    FROM person_details
    WHERE known_for_department = 'Directing'
    ORDER BY CAST(popularity AS float) DESC
    LIMIT 10;
  `
  connection.query(
    query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows.map(row => ({
        src: row.profile_path ? picture_url + picture_size + row.profile_path : default_picture,
        title: row.name
      })));
    }
  });
}

// Route 2: GET /api/top-actors
const top_actors = async function(req, res) {
  query = `
    SELECT name, profile_path
    from person_details
    WHERE gender = '2'
    AND known_for_department LIKE 'Act%'
    ORDER BY CAST(popularity AS float) DESC
    LIMIT 10;
  `
  connection.query(
    query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows.map(row => ({
        src: row.profile_path ? picture_url + picture_size + row.profile_path : default_picture,
        title: row.name
      })));
    }
  });
}

// Route 3: GET /api/top-acturesses
const top_actresses = async function(req, res) {
  query = `
    SELECT name, profile_path
    from person_details
    WHERE gender = '1'
    AND known_for_department LIKE 'Act%'
    ORDER BY CAST(popularity AS float) DESC
    LIMIT 10;
  `
  connection.query(
    query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows.map(row => ({
        src: row.profile_path ? picture_url + picture_size + row.profile_path : default_picture,
        title: row.name
      })));
    }
  });
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
  getMovies,  // Bowen Xiang added on Nov 27
  top_directors,
  top_actors,
  top_actresses,
}
