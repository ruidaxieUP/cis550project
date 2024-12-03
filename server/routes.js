const { Pool, types } = require("pg");
const config = require("./config.json");

const picture_url = "https://image.tmdb.org/t/p/";
const picture_size = "w500";
const default_picture =
  "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png";

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10)); //DO NOT DELETE THIS

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

function make_picture_url(size, fname) {
  return picture_url + size + fname;
}

// Route 1: GET /api/top-directors
const topDirectors = async function (req, res) {
  query = `
    SELECT name, profile_path
    FROM person_details
    WHERE known_for_department = 'Directing'
    AND profile_path is not null
    ORDER BY popularity DESC
    LIMIT 10;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          src: make_picture_url(picture_size, row.profile_path),
          title: row.name,
        }))
      );
    }
  });
};

// Route 2: GET /api/top-actors
const topActors = async function (req, res) {
  query = `
    SELECT name, profile_path
    from person_details
    WHERE gender = '2'
    AND profile_path is not null
    AND known_for_department LIKE 'Act%'
    ORDER BY popularity DESC
    LIMIT 10;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          src: make_picture_url(picture_size, row.profile_path),
          title: row.name,
        }))
      );
    }
  });
};

// Route 3: GET /api/top-actresses
const topActresses = async function (req, res) {
  query = `
    SELECT name, profile_path
    from person_details
    WHERE gender = '1'
    AND profile_path is not null
    AND known_for_department LIKE 'Act%'
    ORDER BY popularity DESC
    LIMIT 10;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          src: make_picture_url(picture_size, row.profile_path),
          title: row.name,
        }))
      );
    }
  });
};

// Route 4: GET /api/top-combos
const topCombos = async function (req, res) {
  query = `
    with cast_director as (
        select movie_cast.person_id as cast_id,
                movie_cast.name as actor_name,
                movie_cast.profile_path as actor_image,
                movie_crew.person_id as director_id,
                movie_crew.name as director_name,
                movie_crew.profile_path as director_image,
                movie_details.vote_average as rating
        from movie_cast
        join movie_crew
        on movie_cast.movie_id = movie_crew.movie_id
        join movie_details
        on movie_cast.movie_id = movie_details.id
        where movie_crew.job = 'Director'
        and movie_cast.profile_path is not null
        and movie_crew.profile_path is not null
    ),
    best_combo as (
        select distinct on (director_id)
            actor_name, actor_image, director_name, director_id, director_image, avg(rating) as average_rating
        from cast_director
        group by actor_name, actor_image, director_name, director_id, director_image
        having count(rating) > 2
        order by director_id desc
    )
    select actor_name, actor_image, director_name, director_image
    from best_combo
    order by average_rating desc
    limit 10;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          actorName: row.actor_name,
          actorImage: make_picture_url(picture_size, row.actor_image),
          directorName: row.director_name,
          directorImage: make_picture_url(picture_size, row.director_image),
        }))
      );
    }
  });
};

// Bowen Xiang: Movie main page
const getMovies = async function (req, res) {
  try {
    // Parse query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 16;
    const filter = req.query.filter || "popularity_desc";

    const validFilters = {
      name_asc: "name ASC",
      name_desc: "name DESC",
      popularity_asc: "popularity ASC",
      popularity_desc: "popularity DESC",
    };

    const orderClause = validFilters[filter];
    if (!orderClause) {
      return res.status(400).json({ error: "Invalid filter value" });
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Fixed query with proper type casting for popularity
    const queryText = `
          SELECT 
              id,
              COALESCE(poster_path, '') as image,
              title as name,
              popularity
              -- // ROUND(CAST(popularity as numeric), 3) as popularity
          FROM movie_details
          WHERE 
              title ~ '^[A-Za-z0-9]'  -- Start with alphanumeric character
              AND popularity > 0.5
              -- AND CAST(popularity AS numeric) > 0.5     -- Fixed: Cast popularity to numeric
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
              AND popularity > 0.5
              -- AND CAST(popularity AS numeric) > 0.5
              AND title != ''
      `;

    // Execute both queries using the existing connection
    const [moviesResult, countResult] = await Promise.all([
      connection.query(queryText, [pageSize, offset]),
      connection.query(countText),
    ]);

    // Calculate pagination values
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Transform image paths to URLs
    const transformedResults = moviesResult.rows.map((movie) => ({
      id: movie.id,
      image: make_picture_url(picture_size, movie.image),
      name: movie.name,
      popularity: movie.popularity,
    }));

    // Prepare and send response
    const response = {
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    };
    res.json(response);
  } catch (err) {
    console.error("Error in /movies endpoint:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Route 7: GET /api/random
const getRandom = async function (req, res) {
  const query = `
    SELECT id,
           backdrop_path
    FROM movie_details
    WHERE backdrop_path IS NOT NULL
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
    } else if (data.rows.length === 0) {
      res.status(404).json({ error: "No picture found" });
    } else {
      const row = data.rows[0];
      res.json({
        src: make_picture_url(picture_size, row.backdrop_path),
      });
    }
  });
};

// Route 8: GET /api/persons
const getPersons = async (req, res) => {
  try {
    // Parse and validate query parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page >= 1
    const pageSize = Math.max(parseInt(req.query.pageSize) || 16, 1); // Ensure pageSize >= 1
    const filter = req.query.filter || "popularity_desc";

    const validFilters = {
      name_asc: "name ASC",
      name_desc: "name DESC",
      popularity_asc: "popularity ASC",
      popularity_desc: "popularity DESC",
    };

    const orderClause = validFilters[filter];
    if (!orderClause) {
      return res.status(400).json({ error: "Invalid filter value" });
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // SQL query with placeholders
    const queryText = `
          SELECT 
              id,
              COALESCE(profile_path, '') AS image,
              name,
              popularity
          FROM person_details
          WHERE 
              name ~ '^[A-Za-z0-9]'  -- Start with alphanumeric character
              AND popularity > 0.5   -- Minimum popularity threshold
          ORDER BY 
              CASE WHEN profile_path IS NULL THEN 1 ELSE 0 END,  -- Persons with images first
              ${orderClause}
          LIMIT $1 OFFSET $2
      `;

    const countText = `
          SELECT COUNT(*) AS total
          FROM person_details
          WHERE 
              name ~ '^[A-Za-z0-9]'
              AND popularity > 0.5
      `;

    // Execute queries in parallel
    const [personsResult, countResult] = await Promise.all([
      connection.query(queryText, [pageSize, offset]),
      connection.query(countText),
    ]);

    // Extract total items and calculate total pages
    const totalItems = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Transform image paths to URLs
    const transformedResults = personsResult.rows.map((person) => ({
      id: person.id,
      image: make_picture_url(picture_size, person.image),
      name: person.name,
      popularity: person.popularity,
    }));

    // Prepare response
    res.json({
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (err) {
    console.error("Error fetching person details:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Route 9: GET /api/movies/:movie_id
const getMovieInfo = async function (req, res) {
  const movie_id = req.params.movie_id;
  query = `
    with top_5_cast as
        (select movie_id, name
        from movie_cast
        where movie_id = ${movie_id}
        order by popularity desc
        limit 5),
    cast_names as
        (select movie_id, STRING_AGG(name, ', ') AS names
        from top_5_cast
        group by movie_id),
    director_names as
        (select movie_id, STRING_AGG(name, ', ') AS names
        from movie_crew
        where job in ('Director', 'Co-Director')
        and movie_id = ${movie_id}
        group by movie_id)
    select id as movie_id, poster_path, title as movie_name,
            vote_average as rating, vote_count as votes, status,
            director_names.names as directors,
            cast_names.names as casts,
            extract (year from release_date) as production_year,
            TO_CHAR(release_date, 'YYYY-MM-DD') AS release_date,
            runtime as duration,
            revenue, budget, overview
    from director_names
    join cast_names on director_names.movie_id = cast_names.movie_id
    join movie_details on cast_names.movie_id = movie_details.id
    order by popularity desc;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      row = data.rows[0];
      res.json({
        poster_path: make_picture_url(picture_size, row.poster_path),
        movie_name: row.movie_name,
        production_year: row.production_year,
        rating: parseFloat(row.rating),
        votes: row.votes,
        status: row.status,
        director: row.directors,
        cast: row.casts,
        released_date: row.released_date,
        duration: row.duration,
        budget: row.budget,
        revenue: row.revenue,
        overview: row.overview,
      });
    }
  });
};

// Route 10: GET /api/movie-casts/:movie_id
const getMovieCasts = async function (req, res) {
  const movie_id = req.params.movie_id;
  query = `
    select profile_path, character, name
    from movie_cast
    join movie_details
    on movie_cast.movie_id = movie_details.id
    where movie_id = 319
    order by movie_cast.popularity desc
    limit 9;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          image: make_picture_url(picture_size, row.profile_path),
          characterName: row.character,
          actorName: row.name,
        }))
      );
    }
  });
};

module.exports = {
  getMovies, // Bowen Xiang added on Nov 27
  getPersons,
  getRandom,
  topDirectors,
  topActors,
  topActresses,
  topCombos,
  getMovieInfo,
  getMovieCasts,
};
