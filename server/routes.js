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
  return fname
    ? picture_url + size + fname
    : "https://media.istockphoto.com/id/922962354/vector/no-image-available-sign.jpg?s=612x612&w=0&k=20&c=xbGzQiL_UIMFDUZte1U0end0p3E8iwocIOGt_swlywE=";
}

// Route 1: GET /api/top-directors
const topDirectors = async function (req, res) {
  const redisClient = req.redisClient; // Use Redis client from req
  const cacheKey = "top_directors";

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    const query = `
      SELECT name, profile_path
      FROM person_details
      WHERE known_for_department = 'Directing'
      AND profile_path IS NOT NULL
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));

    // Store the result in Redis with an expiry of 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    console.log('Serving from database');
    res.json(result);
  } catch (err) {
    console.error("Error fetching top directors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Route 2: GET /api/top-actors
const topActors = async function (req, res) {
  const redisClient = req.redisClient; 
  const cacheKey = "top_actors"; 

  try {
    // Check if the data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving top actors from Redis cache");
      return res.json(JSON.parse(cachedData)); 
    }

    const query = `
      SELECT name, profile_path
      FROM person_details
      WHERE gender = '2'
      AND profile_path IS NOT NULL
      AND known_for_department LIKE 'Act%'
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);

    const result = data.rows.map((row) => ({
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));

    // Store the result in Redis with an expiry of 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    console.log("Serving top actors from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top actors:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



// Route 3: GET /api/top-actresses
const topActresses = async function (req, res) {
  const redisClient = req.redisClient; 
  const cacheKey = "top_actresses"; 

  try {
    // Check if the data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving top actresses from Redis cache");
      return res.json(JSON.parse(cachedData)); 
    }

    const query = `
      SELECT name, profile_path
      FROM person_details
      WHERE gender = '1'
      AND profile_path IS NOT NULL
      AND known_for_department LIKE 'Act%'
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);

    const result = data.rows.map((row) => ({
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));

    // Store the result in Redis with an expiry of 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    console.log("Serving top actresses from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top actresses:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



// Route 4: GET /api/top-combos
const topCombos = async function (req, res) {
  const redisClient = req.redisClient; 
  const cacheKey = "top_combos"; 

  try {
    // Check if the data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving top combos from Redis cache");
      return res.json(JSON.parse(cachedData)); 
    }

    const query = `
      WITH cast_director AS (
          SELECT 
              movie_cast.person_id AS cast_id,
              movie_cast.name AS actor_name,
              movie_cast.profile_path AS actor_image,
              movie_crew.person_id AS director_id,
              movie_crew.name AS director_name,
              movie_crew.profile_path AS director_image,
              movie_details.vote_average AS rating
          FROM movie_cast
          JOIN movie_crew
          ON movie_cast.movie_id = movie_crew.movie_id
          JOIN movie_details
          ON movie_cast.movie_id = movie_details.id
          WHERE movie_crew.job = 'Director'
          AND movie_cast.profile_path IS NOT NULL
          AND movie_crew.profile_path IS NOT NULL
      ),
      best_combo AS (
          SELECT DISTINCT ON (director_id)
              actor_name, actor_image, director_name, director_id, director_image, AVG(rating) AS average_rating
          FROM cast_director
          GROUP BY actor_name, actor_image, director_name, director_id, director_image
          HAVING COUNT(rating) > 2
          ORDER BY director_id DESC
      )
      SELECT actor_name, actor_image, director_name, director_image
      FROM best_combo
      ORDER BY average_rating DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);

    const result = data.rows.map((row) => ({
      actorName: row.actor_name,
      actorImage: make_picture_url(picture_size, row.actor_image),
      directorName: row.director_name,
      directorImage: make_picture_url(picture_size, row.director_image),
    }));

    // Store the result in Redis with an expiry of 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    console.log("Serving top combos from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top combos:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



// Bowen Xiang: Movie main page
const getMovies = async function (req, res) {
  const redisClient = req.redisClient; 
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

  const offset = (page - 1) * pageSize;
  const cacheKey = `movies_page_${page}_pageSize_${pageSize}_filter_${filter}`;

  try {
    // Check if data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving /movies data from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    // Query for movies
    const queryText = `
      SELECT 
        id,
        COALESCE(poster_path, '') AS image,
        title AS name,
        popularity
      FROM movie_details
      WHERE 
        title ~ '^[A-Za-z0-9]'
        AND popularity > 0.5
        AND title != ''
      ORDER BY 
        CASE WHEN poster_path IS NULL THEN 1 ELSE 0 END,
        ${orderClause}
      LIMIT $1 OFFSET $2;
    `;
    const countText = `
      SELECT COUNT(*) 
      FROM movie_details
      WHERE 
        title ~ '^[A-Za-z0-9]'
        AND popularity > 0.5
        AND title != '';
    `;

    // Execute both queries
    const [moviesResult, countResult] = await Promise.all([
      connection.query(queryText, [pageSize, offset]),
      connection.query(countText),
    ]);

    // Process results
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / pageSize);
    const transformedResults = moviesResult.rows.map((movie) => ({
      id: movie.id,
      image: make_picture_url(picture_size, movie.image),
      name: movie.name,
      popularity: movie.popularity,
    }));

    // Prepare response
    const response = {
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    };

    // Cache response
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });

    console.log("Serving /movies data from database");
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

// redis version of Route 7: getRandom
// const getRandom = async function (req, res) {
//   const cacheKey = "random_picture"; // Define a cache key for the random picture

//   try {
//     // Check if the data is cached in Redis
//     const cachedData = await redisClient.get(cacheKey);
//     if (cachedData) {
//       console.log("Serving random picture from Redis cache");
//       return res.json(JSON.parse(cachedData)); // Serve cached data
//     }

//     // Query the database if no cache exists
//     const query = `
//       SELECT id,
//              backdrop_path
//       FROM movie_details
//       WHERE backdrop_path IS NOT NULL
//       ORDER BY RANDOM()
//       LIMIT 1;
//     `;

//     const data = await connection.query(query);
//     if (data.rows.length === 0) {
//       return res.status(404).json({ error: "No picture found" });
//     }

//     const row = data.rows[0];
//     const result = {
//       src: make_picture_url(picture_size, row.backdrop_path),
//     };

//     // Store the result in Redis with an expiry of 1 hour
//     await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

//     console.log("Serving random picture from database");
//     res.json(result);
//   } catch (err) {
//     console.error("Error fetching random picture:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// Route 8: GET /api/persons

// Route 8: GET /api/persons
const getPersons = async (req, res) => {
  const redisClient = req.redisClient; // Fetch redis client from the request object
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

  const offset = (page - 1) * pageSize;
  const cacheKey = `persons_page_${page}_pageSize_${pageSize}_filter_${filter}`; // Unique cache key

  try {
    // Check if the data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving persons data from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

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
          LIMIT $1 OFFSET $2;
      `;

    const countText = `
          SELECT COUNT(*) AS total
          FROM person_details
          WHERE 
              name ~ '^[A-Za-z0-9]'
              AND popularity > 0.5;
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
    const response = {
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    };

    // Store the response in Redis with a 1-hour expiration
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });

    console.log("Serving persons data from database");
    res.json(response);
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
  const redisClient = req.redisClient; // Get the Redis client from the request
  const movie_id = req.params.movie_id;
  const cacheKey = `movie_info_${movie_id}`; // Define a unique cache key for this movie ID

  const query = `
    WITH top_5_cast AS (
        SELECT movie_id, name
        FROM movie_cast
        WHERE movie_id = ${movie_id}
        ORDER BY popularity DESC
        LIMIT 5
    ),
    cast_names AS (
        SELECT movie_id, STRING_AGG(name, ', ') AS names
        FROM top_5_cast
        GROUP BY movie_id
    ),
    director_names AS (
        SELECT movie_id, STRING_AGG(name, ', ') AS names
        FROM movie_crew
        WHERE job IN ('Director', 'Co-Director')
        AND movie_id = ${movie_id}
        GROUP BY movie_id
    )
    SELECT id AS movie_id, poster_path, title AS movie_name,
           vote_average AS rating, vote_count AS votes, status,
           director_names.names AS directors,
           cast_names.names AS casts,
           EXTRACT(YEAR FROM release_date) AS production_year,
           TO_CHAR(release_date, 'YYYY-MM-DD') AS release_date,
           runtime AS duration,
           revenue, budget, overview
    FROM director_names
    JOIN cast_names ON director_names.movie_id = cast_names.movie_id
    JOIN movie_details ON cast_names.movie_id = movie_details.id
    ORDER BY popularity DESC;
  `;

  try {
    // Check if the data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Serving movie info for movie_id: ${movie_id} from Redis cache`);
      return res.json(JSON.parse(cachedData)); // Serve cached data
    }

    // Execute the query if no cached data is found
    const data = await connection.query(query);

    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const row = data.rows[0];
    const result = {
      poster_path: make_picture_url(picture_size, row.poster_path),
      movie_name: row.movie_name,
      production_year: row.production_year,
      rating: parseFloat(row.rating),
      votes: row.votes,
      status: row.status,
      director: row.directors,
      cast: row.casts,
      released_date: row.release_date,
      duration: row.duration,
      budget: row.budget,
      revenue: row.revenue,
      overview: row.overview,
    };

    // Store the result in Redis with an expiry of 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    console.log(`Serving movie info for movie_id: ${movie_id} from database`);
    res.json(result);
  } catch (err) {
    console.error(`Error fetching movie info for movie_id: ${movie_id}`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Route 10: GET /api/movie-casts/:movie_id
const getMovieCasts = async function (req, res) {
  const movie_id = req.params.movie_id;
  query = `
    select person_id, profile_path, character, name
    from movie_cast
    join movie_details
    on movie_cast.movie_id = movie_details.id
    where movie_id = ${movie_id}
    order by movie_cast.popularity desc
    limit 10;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          id: row.person_id,
          image: make_picture_url(picture_size, row.profile_path),
          characterName: row.character,
          actorName: row.name,
        }))
      );
    }
  });
};

// Route 11: GET /api/movie-genres/:movie_id
const getMovieGenres = async function (req, res) {
  const movie_id = req.params.movie_id;
  query = `
    select distinct genres.id, genres.name
    from genres
    join movie_genres
    on genres.id = movie_genres.genre_id
    where movie_id = ${movie_id};
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          id: row.id,
          name: row.name,
        }))
      );
    }
  });
};

// Route 12: GET /api/similar-movies/:movie_id
const getSimilarMovies = async function (req, res) {
  const movie_id = req.params.movie_id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8;
  const offset = (page - 1) * pageSize;

  const query = `
    WITH this_movie_genres AS (
        SELECT genre_id
        FROM movie_genres
        WHERE movie_id = ${movie_id}
    ),
    matching_movies AS (
        SELECT
            t2.movie_id,
            COUNT(*) AS matching_genres_count
        FROM movie_genres t2
        INNER JOIN this_movie_genres mg ON t2.genre_id = mg.genre_id
        WHERE t2.movie_id != ${movie_id}
        GROUP BY t2.movie_id
    ),
    similar_movie_ids AS (
        SELECT m.movie_id
        FROM matching_movies m
        WHERE m.matching_genres_count = (SELECT COUNT(*) FROM this_movie_genres)
        OR m.matching_genres_count >= 3
    ),
    ranked_movies AS (
        SELECT
            movie_details.id AS movie_id,
            movie_details.title,
            movie_details.vote_average,
            movie_details.poster_path,
            ROW_NUMBER() OVER (ORDER BY movie_details.vote_average DESC) AS row_num
        FROM similar_movie_ids
        JOIN movie_details
          ON similar_movie_ids.movie_id = movie_details.id
    )
    SELECT
        rm.movie_id,
        rm.title,
        rm.vote_average,
        rm.poster_path,
        JSON_AGG(
            JSON_BUILD_OBJECT('id', genres.id, 'name', genres.name)
        ) AS genres
    FROM ranked_movies rm
    JOIN movie_genres
        ON rm.movie_id = movie_genres.movie_id
    JOIN genres
        ON movie_genres.genre_id = genres.id
    WHERE rm.row_num > ${offset} AND rm.row_num <= ${offset} + ${pageSize}
    GROUP BY rm.movie_id, rm.title, rm.vote_average, rm.poster_path
    ORDER BY rm.vote_average DESC;
  `;

  const countQuery = `
    WITH this_movie_genres AS (
        SELECT genre_id
        FROM movie_genres
        WHERE movie_id = ${movie_id}
    ),
    matching_movies AS (
        SELECT
            t2.movie_id,
            COUNT(*) AS matching_genres_count
        FROM movie_genres t2
        INNER JOIN this_movie_genres mg ON t2.genre_id = mg.genre_id
        WHERE t2.movie_id != ${movie_id}
        GROUP BY t2.movie_id
    ),
    similar_movie_ids AS (
        SELECT m.movie_id
        FROM matching_movies m
        WHERE m.matching_genres_count = (SELECT COUNT(*) FROM this_movie_genres)
        OR m.matching_genres_count >= 3
    )
    SELECT COUNT(*) AS total
    FROM similar_movie_ids;
  `;

  try {
    const [data, countData] = await Promise.all([
      connection.query(query),
      connection.query(countQuery),
    ]);

    const totalItems = parseInt(countData.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / pageSize);

    const results = data.rows.map((row) => ({
      id: row.movie_id,
      title: row.title,
      rating: parseFloat(row.vote_average),
      image: make_picture_url(picture_size, row.poster_path),
      genres: row.genres,
    }));

    res.json({
      results,
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (err) {
    console.error("Error fetching similar movies:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};




// Route 13: GET /api/persons/:person_id
const getPersonInfo = async function (req, res) {
  const person_id = req.params.person_id;
  query = `
    select id, name, profile_path, biography, known_for_department
    from person_details
    where id = ${person_id};
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      row = data.rows[0];
      res.json({
        id: row.id,
        name: row.name,
        imagePath: make_picture_url(picture_size, row.profile_path),
        knownForDepartment: row.known_for_department,
        bio: row.biography,
      });
    }
  });
};

// Route 12: GET /api/person-genres/:movie_id
const getPersonGenres = async function (req, res) {
  const person_id = req.params.person_id;
  query = `
    with cast_crew as (
        select name, profile_path, movie_id, person_id, popularity
        from movie_cast
        union all
        select name, profile_path, movie_id, person_id, popularity
        from movie_crew
    )
    select genre_id, genres.name, count(genres.name) as count
    from cast_crew
    join movie_genres
    on cast_crew.movie_id = movie_genres.movie_id
    join genres
    on movie_genres.genre_id = genres.id
    where person_id = ${person_id}
    group by genre_id, genres.name
    order by count desc
    limit 3;
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(
        data.rows.map((row) => ({
          id: row.genre_id,
          name: row.name,
        }))
      );
    }
  });
};

// Route 13: GET /api/person-known-for/:person_id
const getPersonKnownFor = async function (req, res) {
  const person_id = req.params.person_id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8; // Default to 8 items per page
  const offset = (page - 1) * pageSize;

  query = `
    with cast_crew as (
        select name, character, movie_id, person_id, popularity, profile_path
        from movie_cast
        union all
        select name, 'Director' as character, movie_id, person_id, popularity, profile_path
        from movie_crew
    )
    select 
        movie_details.id AS movie_id,
        movie_details.poster_path,
        movie_details.title,
        cast_crew.character,
        movie_details.vote_average
    from cast_crew
    join movie_details
    on cast_crew.movie_id = movie_details.id
    where person_id = ${person_id}
    order by movie_details.popularity desc
    limit ${pageSize} offset ${offset};
  `;

  // Query to get the total count of results for pagination
  const countQuery = `
    with cast_crew as (
        select name, character, movie_id, person_id, popularity, profile_path
        FROM movie_cast
        UNION ALL
        SELECT name, 'Director' as character, movie_id, person_id, popularity, profile_path
        FROM movie_crew
    )
    SELECT COUNT(*) AS total
    FROM cast_crew
    JOIN movie_details
    ON cast_crew.movie_id = movie_details.id
    WHERE person_id = ${person_id};
  `;

  try {
    const [data, countData] = await Promise.all([
      connection.query(query),
      connection.query(countQuery),
    ]);

    const totalItems = parseInt(countData.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      results: data.rows.map((row) => ({
        movieId: row.movie_id, // Include movie_id in the response
        posterPath: make_picture_url(picture_size, row.poster_path),
        movieName: row.title,
        characterName: row.character,
        rating: row.vote_average,
      })),
      currentPage: page,
      totalPages,
      totalItems,
    });
  } catch (err) {
    console.error("Error fetching person known for:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Route 14: GET /api/person-collaborators/:person_id
const getPersonCollaborators = async function (req, res) {
  const person_id = req.params.person_id;
  query = `
    with cast_crew as (
        select name, profile_path, movie_id, person_id, popularity
        from movie_cast
        union all
        select name, profile_path, movie_id, person_id, popularity
        from movie_crew
    ),
    top_collaborators as (
        select name, profile_path, popularity
        from cast_crew
        where cast_crew.person_id <> ${person_id}
        and movie_id in (select movie_id
                      from cast_crew
                      where person_id = ${person_id})
    ),
    ordered_rows AS (
        SELECT
            *,
            ROW_NUMBER() OVER (PARTITION BY name) AS row_num
        FROM top_collaborators
    )
    SELECT name, profile_path
    FROM ordered_rows
    where row_num = 1
    order by popularity desc
    limit 10;
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

// Route 15: GET /api/search-persons
const searchPersons = async function (req, res) {
  const { query = "", page = 1, pageSize = 10 } = req.query;

  if (!query.trim()) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const offset = (page - 1) * pageSize;

  const sqlQuery = `
    SELECT id, profile_path, known_for_department, name
    FROM person_details
    WHERE LOWER(name) LIKE $1
    ORDER BY popularity DESC
    LIMIT $2 OFFSET $3;
  `;

  connection.query(
    sqlQuery,
    [`%${query.toLowerCase()}%`, parseInt(pageSize), offset],
    (err, data) => {
      if (err) {
        console.error("Error fetching search results:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({
          results: data.rows.map((row) => ({
            id: row.id,
            profile_path: make_picture_url(picture_size, row.profile_path),
            known_for_department: row.known_for_department || "Unknown",
            name: row.name,
          })),
        });
      }
    }
  );
};
// Export the functions
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
  getMovieGenres,
  getSimilarMovies,
  getPersonInfo,
  getPersonGenres,
  getPersonKnownFor,
  getPersonCollaborators,
  searchPersons,
};
