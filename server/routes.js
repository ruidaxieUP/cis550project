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


module.exports = {
  top_directors,
  top_actors,
  top_actresses,
}
