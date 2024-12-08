const { Pool, types } = require("pg");
const config = require("./config.json");

const picture_url = "https://image.tmdb.org/t/p/";
const picture_size = "w500";
const default_picture =
  "https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: config.auth,
  }
};

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
//DO NOT DELETE THIS
types.setTypeParser(20, (val) => parseInt(val, 10));

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

async function getCachedData(redisClient, cacheKey) {
  const cachedData = await redisClient.get(cacheKey);
  return cachedData ? JSON.parse(cachedData) : null;
}

async function setCachedData(redisClient, cacheKey, data) {
  await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 });
}

// Route 1: GET /api/top-directors
const topDirectors = async (req, res) => {
  const redisClient = req.redisClient;
  const cacheKey = "top_directors";
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving from Redis cache");
      return res.json(cachedData);
    }
    const query = `
      SELECT id, name, profile_path
      FROM person_details
      WHERE known_for_department = 'Directing'
      AND profile_path IS NOT NULL
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      id: row.id,
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));
    await setCachedData(redisClient, cacheKey, result);
    console.log("Serving from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top directors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route 2: GET /api/top-actors
const topActors = async (req, res) => {
  const redisClient = req.redisClient;
  const cacheKey = "top_actors";
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving top actors from Redis cache");
      return res.json(cachedData);
    }
    const query = `
      SELECT id, name, profile_path
      FROM person_details
      WHERE gender = '2'
      AND profile_path IS NOT NULL
      AND known_for_department LIKE 'Act%'
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      id: row.id,
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));
    await setCachedData(redisClient, cacheKey, result);
    console.log("Serving top actors from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top actors:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Route 3: GET /api/top-actresses
const topActresses = async (req, res) => {
  const redisClient = req.redisClient;
  const cacheKey = "top_actresses";
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving top actresses from Redis cache");
      return res.json(cachedData);
    }
    const query = `
      SELECT id, name, profile_path
      FROM person_details
      WHERE gender = '1'
      AND profile_path IS NOT NULL
      AND known_for_department LIKE 'Act%'
      ORDER BY popularity DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      id: row.id,
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));
    await setCachedData(redisClient, cacheKey, result);
    console.log("Serving top actresses from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top actresses:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Route 4: GET /api/top-combos
const topCombos = async (req, res) => {
  const redisClient = req.redisClient;
  const cacheKey = "top_combos";
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving top combos from Redis cache");
      return res.json(cachedData);
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
              cast_id, actor_name, actor_image, director_name, director_id, director_image, AVG(rating) AS average_rating
          FROM cast_director
          GROUP BY cast_id, actor_name, actor_image, director_name, director_id, director_image
          HAVING COUNT(rating) > 2
          ORDER BY director_id DESC
      )
      SELECT cast_id, actor_name, actor_image, director_id, director_name, director_image
      FROM best_combo
      ORDER BY average_rating DESC
      LIMIT 10;
    `;
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      actor_id: row.cast_id,
      actorName: row.actor_name,
      actorImage: make_picture_url(picture_size, row.actor_image),
      director_id: row.director_id,
      directorName: row.director_name,
      directorImage: make_picture_url(picture_size, row.director_image),
    }));
    await setCachedData(redisClient, cacheKey, result);
    console.log("Serving top combos from database");
    res.json(result);
  } catch (err) {
    console.error("Error fetching top combos:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Route 5: Get /api/movies Bowen Xiang: Movie main page
const getMovies = async (req, res) => {
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
  if (!orderClause) return res.status(400).json({ error: "Invalid filter value" });
  const offset = (page - 1) * pageSize;
  const cacheKey = `movies_page_${page}_pageSize_${pageSize}_filter_${filter}`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving /movies data from Redis cache");
      return res.json(cachedData);
    }
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
    const [moviesResult, countResult] = await Promise.all([
      connection.query(queryText, [pageSize, offset]),
      connection.query(countText),
    ]);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / pageSize);
    const transformedResults = moviesResult.rows.map((movie) => ({
      id: movie.id,
      image: make_picture_url(picture_size, movie.image),
      name: movie.name,
      popularity: movie.popularity,
    }));
    const response = {
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    };
    await setCachedData(redisClient, cacheKey, response);
    console.log("Serving /movies data from database");
    res.json(response);
  } catch (err) {
    console.error("Error in /movies endpoint:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Route 6: GET /api/random
// const getRandom = async function (req, res) {
//   const query = 
//     SELECT id, backdrop_path
// FROM movie_details
// WHERE backdrop_path IS NOT NULL
// OFFSET FLOOR(RANDOM() * (SELECT COUNT(*) FROM movie_details WHERE backdrop_path IS NOT NULL))
// LIMIT 1;

//   ;

//   connection.query(query, (err, data) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       res.status(500).json({ error: "Internal server error" });
//     } else if (data.rows.length === 0) {
//       res.status(404).json({ error: "No picture found" });
//     } else {
//       const row = data.rows[0];
//       res.json({
//         src: make_picture_url(picture_size, row.backdrop_path),
//       });
//     }
//   });
// };

// Route 7: GET /api/persons

const getRandom = async (req, res) => {
  const redisClient = req.redisClient;
  const screen = req.query.screen || "default";
  const cacheKey = `random_picture_${screen}`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log(`Serving random picture for ${screen} from Redis cache`);
      return res.json(cachedData);
    }
    const query = `
      SELECT id,
             backdrop_path
      FROM movie_details
      WHERE backdrop_path IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 1;
    `;
    const data = await connection.query(query);
    if (data.rows.length === 0) return res.status(404).json({ error: "No picture found" });
    const row = data.rows[0];
    const result = {
      src: make_picture_url(picture_size, row.backdrop_path),
    };
    await setCachedData(redisClient, cacheKey, result);
    console.log(`Serving random picture for ${screen} from database`);
    res.json(result);
  } catch (err) {
    console.error("Error fetching random picture:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route 7: GET /api/persons
const getPersons = async (req, res) => {
  const redisClient = req.redisClient;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const pageSize = Math.max(parseInt(req.query.pageSize) || 16, 1);
  const filter = req.query.filter || "popularity_desc";
  const validFilters = {
    name_asc: "name ASC",
    name_desc: "name DESC",
    popularity_asc: "popularity ASC",
    popularity_desc: "popularity DESC",
  };
  const orderClause = validFilters[filter];
  if (!orderClause) return res.status(400).json({ error: "Invalid filter value" });
  const offset = (page - 1) * pageSize;
  const cacheKey = `persons_page_${page}_pageSize_${pageSize}_filter_${filter}`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log("Serving persons data from Redis cache");
      return res.json(cachedData);
    }
    const queryText = `
          SELECT 
              id,
              COALESCE(profile_path, '') AS image,
              name,
              popularity
          FROM person_details
          WHERE 
              name ~ '^[A-Za-z0-9]' 
              AND popularity > 0.5
          ORDER BY 
              CASE WHEN profile_path IS NULL THEN 1 ELSE 0 END,
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
    const [personsResult, countResult] = await Promise.all([
      connection.query(queryText, [pageSize, offset]),
      connection.query(countText),
    ]);
    const totalItems = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / pageSize);
    const transformedResults = personsResult.rows.map((person) => ({
      id: person.id,
      image: make_picture_url(picture_size, person.image),
      name: person.name,
      popularity: person.popularity,
    }));
    const response = {
      results: transformedResults,
      currentPage: page,
      totalPages,
      totalItems,
    };
    await setCachedData(redisClient, cacheKey, response);
    console.log("Serving persons data from database");
    res.json(response);
  } catch (err) {
    console.error("Error fetching person details:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Route 8: GET /api/movies/:movie_id
const getMovieInfo = async (req, res) => {
  const movie_id = req.params.movie_id;
  const cacheKey = `movie_info_${movie_id}`;
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
  const dbTransformer = (rows) =>
    rows.map((row) => ({
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
    }))[0];
  const tmdbTransformer = async (data) => {
    const fetch = (await import("node-fetch")).default;
    const creditsResponse = await fetch(`${TMDB_BASE_URL}/movie/${movie_id}/credits`, options);
    const creditsData = await creditsResponse.json();
    const director = creditsData.crew.find((person) => person.job === "Director")?.name || "Unknown";
    const cast = creditsData.cast.slice(0, 5).map((actor) => actor.name).join(", ") || "Unknown";
    return {
      poster_path: make_picture_url(picture_size, data.poster_path),
      movie_name: data.title,
      production_year: new Date(data.release_date).getFullYear(),
      rating: data.vote_average,
      votes: data.vote_count,
      status: data.status,
      director,
      cast,
      released_date: data.release_date,
      duration: data.runtime,
      budget: data.budget,
      revenue: data.revenue,
      overview: data.overview,
    };
  };
  const tmdbURL = `${TMDB_BASE_URL}/movie/${movie_id}`;
  try {
    const redisClient = req.redisClient;
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const dbData = await connection.query(query);
    if (dbData.rows.length === 0) throw new Error("No data found in the database");
    const result = dbTransformer(dbData.rows);
    await setCachedData(redisClient, cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      const redisClient = req.redisClient;
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 9: GET /api/movie-casts/:movie_id
const getMovieCasts = async (req, res) => {
  const redisClient = req.redisClient;
  const movie_id = req.params.movie_id;
  const cacheKey = `movie_casts_${movie_id}`;
  const query = `
    SELECT person_id, profile_path, character, name
    FROM movie_cast
    JOIN movie_details
    ON movie_cast.movie_id = movie_details.id
    WHERE movie_id = ${movie_id}
    ORDER BY movie_cast.popularity DESC
    LIMIT 10;
  `;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log(`Serving movie casts for movie_id: ${movie_id} from Redis cache`);
      return res.json(cachedData);
    }
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      id: row.person_id,
      image: make_picture_url(picture_size, row.profile_path),
      characterName: row.character,
      actorName: row.name,
    }));
    await setCachedData(redisClient, cacheKey, result);
    console.log(`Serving movie casts for movie_id: ${movie_id} from database`);
    res.json(result);
  } catch (err) {
    console.error(`Error fetching movie casts for movie_id: ${movie_id}`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route 10: GET /api/movie-genres/:movie_id
const getMovieGenres = async (req, res) => {
  const redisClient = req.redisClient;
  const movie_id = req.params.movie_id;
  const cacheKey = `movie_genres_${movie_id}`;
  const query = `
    SELECT DISTINCT genres.id, genres.name
    FROM genres
    JOIN movie_genres
    ON genres.id = movie_genres.genre_id
    WHERE movie_id = ${movie_id};
  `;
  const fetchGenresFromTMDB = async (movie_id) => {
    const fetch = (await import('node-fetch')).default;
    const url = `${TMDB_BASE_URL}/movie/${movie_id}`;
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Failed to fetch from TMDB');
    const data = await response.json();
    const genres = data.genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }));
    await setCachedData(redisClient, cacheKey, genres);
    return genres;
  };
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log(`Serving movie genres for movie_id: ${movie_id} from Redis cache`);
      return res.json(cachedData);
    }
    const data = await connection.query(query);
    const result = data.rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
    if (result.length === 0) throw new Error('No data found in the database');
    await setCachedData(redisClient, cacheKey, result);
    return res.json(result);
  } catch (error) {
    console.error(`Database error or no data found for movie_id: ${movie_id}`, error);
    try {
      const tmdbGenres = await fetchGenresFromTMDB(movie_id);
      return res.json(tmdbGenres);
    } catch (tmdbError) {
      console.error(`Fallback to TMDB failed for movie_id: ${movie_id}`, tmdbError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Route 11: GET /api/similar-movies/:movie_id
const getSimilarMovies = async (req, res) => {
  const movie_id = req.params.movie_id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8;
  const cacheKey = `similar_movies_${movie_id}_page_${page}_pageSize_${pageSize}`;
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
    WHERE rm.row_num > ${(page - 1) * pageSize} AND rm.row_num <= ${page * pageSize}
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
  const dbTransformer = (rows, totalItems) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      results: rows.map((row) => ({
        id: row.movie_id,
        title: row.title,
        rating: parseFloat(row.vote_average),
        image: make_picture_url(picture_size, row.poster_path),
        genres: row.genres,
      })),
      currentPage: page,
      totalPages,
    };
  };
  const tmdbTransformer = async (data) => {
    const fetch = (await import("node-fetch")).default;
    const moviesWithGenres = await Promise.all(
      data.results.map(async (movie) => {
        const genreResponse = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}`, options);
        const genreData = await genreResponse.json();
        return {
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          image: make_picture_url(picture_size, movie.poster_path),
          genres: genreData.genres.map((genre) => ({ id: genre.id, name: genre.name })),
        };
      })
    );
    return {
      results: moviesWithGenres,
      currentPage: data.page,
      totalPages: data.total_pages,
    };
  };
  const tmdbURL = `${TMDB_BASE_URL}/movie/${movie_id}/similar?page=${page}`;
  try {
    const redisClient = req.redisClient;
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const [dbData, countData] = await Promise.all([connection.query(query), connection.query(countQuery)]);
    const totalItems = parseInt(countData.rows[0].total, 10);
    const result = dbTransformer(dbData.rows, totalItems);
    await setCachedData(redisClient, cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      const redisClient = req.redisClient;
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 12: GET /api/persons/:person_id
const getPersonInfo = async (req, res) => {
  const redisClient = req.redisClient;
  const person_id = req.params.person_id;
  const cacheKey = `person_info_${person_id}`;
  const query = `
    SELECT id, name, profile_path, biography, known_for_department
    FROM person_details
    WHERE id = ${person_id};
  `;
  const tmdbTransformer = async (data) => ({
    id: data.id,
    name: data.name,
    imagePath: make_picture_url(picture_size, data.profile_path),
    knownForDepartment: data.known_for_department || "Unknown",
    bio: data.biography || "No biography available",
  });
  const tmdbURL = `${TMDB_BASE_URL}/person/${person_id}`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const dbData = await connection.query(query);
    if (dbData.rows.length === 0) throw new Error("No data found in the database");
    const result = dbData.rows.map((row) => ({
      id: row.id,
      name: row.name,
      imagePath: make_picture_url(picture_size, row.profile_path),
      knownForDepartment: row.known_for_department,
      bio: row.biography,
    }))[0];
    await setCachedData(redisClient, cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 13: GET /api/person-genres/:movie_id
const getPersonGenres = async (req, res) => {
  const redisClient = req.redisClient;
  const person_id = req.params.person_id;
  const cacheKey = `person_genres_${person_id}`;
  const query = `
    WITH cast_crew AS (
        SELECT name, profile_path, movie_id, person_id, popularity
        FROM movie_cast
        UNION ALL
        SELECT name, profile_path, movie_id, person_id, popularity
        FROM movie_crew
    )
    SELECT genre_id, genres.name, COUNT(genres.name) AS count
    FROM cast_crew
    JOIN movie_genres
    ON cast_crew.movie_id = movie_genres.movie_id
    JOIN genres
    ON movie_genres.genre_id = genres.id
    WHERE person_id = ${person_id}
    GROUP BY genre_id, genres.name
    ORDER BY count DESC
    LIMIT 3;
  `;
  const tmdbTransformer = async (data) => {
    const fetch = (await import("node-fetch")).default;
    const movieIDs = data.movie_credits.cast.map((movie) => movie.id);
    const genreCounts = {};
    for (const id of movieIDs) {
      const movieResponse = await fetch(`${TMDB_BASE_URL}/movie/${id}`, options);
      const movieData = await movieResponse.json();
      movieData.genres.forEach((genre) => {
        if (!genreCounts[genre.id]) {
          genreCounts[genre.id] = { id: genre.id, name: genre.name, count: 0 };
        }
        genreCounts[genre.id].count++;
      });
    }
    return Object.values(genreCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };
  const tmdbURL = `${TMDB_BASE_URL}/person/${person_id}?append_to_response=movie_credits`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const dbData = await connection.query(query);
    const result = dbData.rows.map((row) => ({
      id: row.genre_id,
      name: row.name,
    }));
    if (result.length === 0) throw new Error("No data found in the database");
    await setCachedData(redisClient, cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 14: GET /api/person-known-for/:person_id
const getPersonKnownFor = async (req, res) => {
  const redisClient = req.redisClient;
  const person_id = req.params.person_id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 8;
  const offset = (page - 1) * pageSize;
  const cacheKey = `person_known_for_${person_id}_page_${page}_pageSize_${pageSize}`;
  const query = `
    WITH cast_crew AS (
        SELECT name, character, movie_id, person_id, popularity, profile_path
        FROM movie_cast
        UNION ALL
        SELECT name, 'Director' AS character, movie_id, person_id, popularity, profile_path
        FROM movie_crew
    )
    SELECT 
        movie_details.id AS movie_id,
        movie_details.poster_path,
        movie_details.title,
        cast_crew.character,
        movie_details.vote_average
    FROM cast_crew
    JOIN movie_details
    ON cast_crew.movie_id = movie_details.id
    WHERE person_id = ${person_id}
    ORDER BY movie_details.popularity DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `;
  const countQuery = `
    WITH cast_crew AS (
        SELECT name, character, movie_id, person_id, popularity, profile_path
        FROM movie_cast
        UNION ALL
        SELECT name, 'Director' AS character, movie_id, person_id, popularity, profile_path
        FROM movie_crew
    )
    SELECT COUNT(*) AS total
    FROM cast_crew
    JOIN movie_details
    ON cast_crew.movie_id = movie_details.id
    WHERE person_id = ${person_id};
  `;
  const tmdbTransformer = (data) => ({
    results: data.movie_credits.cast.slice(0, pageSize).map((movie) => ({
      movieId: movie.id,
      posterPath: make_picture_url(picture_size, movie.poster_path),
      movieName: movie.title,
      characterName: movie.character || "N/A",
      rating: movie.vote_average,
    })),
    currentPage: page,
    totalPages: Math.ceil(data.movie_credits.cast.length / pageSize),
  });
  const tmdbURL = `${TMDB_BASE_URL}/person/${person_id}?append_to_response=movie_credits`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const [dbData, countData] = await Promise.all([connection.query(query), connection.query(countQuery)]);
    const totalItems = parseInt(countData.rows[0].total, 10);
    const totalPages = Math.ceil(totalItems / pageSize);
    const results = dbData.rows.map((row) => ({
      movieId: row.movie_id,
      posterPath: make_picture_url(picture_size, row.poster_path),
      movieName: row.title,
      characterName: row.character,
      rating: row.vote_average,
    }));
    const response = { results, currentPage: page, totalPages };
    if (results.length === 0) throw new Error("No data found in the database");
    await setCachedData(redisClient, cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 15: GET /api/person-collaborators/:person_id
const getPersonCollaborators = async (req, res) => {
  const redisClient = req.redisClient;
  const person_id = parseInt(req.params.person_id, 10);
  const cacheKey = `person_collaborators_${person_id}`;
  const query = `
    WITH cast_crew AS (
        SELECT name, profile_path, movie_id, person_id, popularity
        FROM movie_cast
        UNION ALL
        SELECT name, profile_path, movie_id, person_id, popularity
        FROM movie_crew
    ),
    top_collaborators AS (
        SELECT person_id, name, profile_path, popularity
        FROM cast_crew
        WHERE cast_crew.person_id <> ${person_id}
        AND movie_id IN (
            SELECT movie_id
            FROM cast_crew
            WHERE person_id = ${person_id}
        )
    ),
    ordered_rows AS (
        SELECT *,
            ROW_NUMBER() OVER (PARTITION BY name) AS row_num
        FROM top_collaborators
    )
    SELECT person_id as id, name, profile_path
    FROM ordered_rows
    WHERE row_num = 1
    ORDER BY popularity DESC
    LIMIT 10;
  `;
  const tmdbTransformer = async (data) => {
    const fetch = (await import("node-fetch")).default;
    const movies = data.movie_credits.cast.map((movie) => movie.id);
    const collaborators = {};
    for (const movieId of movies) {
      const creditsResponse = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits`, options);
      const creditsData = await creditsResponse.json();
      creditsData.cast.forEach((collaborator) => {
        if (collaborator.id !== person_id) {
          if (!collaborators[collaborator.id]) {
            collaborators[collaborator.id] = {
              id: collaborator.id,
              name: collaborator.name,
              profile_path: collaborator.profile_path,
              appearances: 0,
            };
          }
          collaborators[collaborator.id].appearances++;
        }
      });
    }
    return Object.values(collaborators)
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 10)
      .map((collaborator) => ({
        id: collaborator.id,
        src: make_picture_url(picture_size, collaborator.profile_path),
        title: collaborator.name,
      }));
  };
  const tmdbURL = `${TMDB_BASE_URL}/person/${person_id}?append_to_response=movie_credits`;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) return res.json(cachedData);
    const dbData = await connection.query(query);
    const result = dbData.rows.map((row) => ({
      id: row.id,
      src: make_picture_url(picture_size, row.profile_path),
      title: row.name,
    }));
    if (result.length === 0) throw new Error("No data found in the database");
    await setCachedData(redisClient, cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error("Database error or no data found, trying TMDB:", error);
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(tmdbURL, options);
      if (!response.ok) throw new Error("Failed to fetch from TMDB");
      const tmdbData = await response.json();
      const result = await tmdbTransformer(tmdbData);
      await setCachedData(redisClient, cacheKey, result);
      res.json(result);
    } catch (tmdbError) {
      console.error("Fallback to TMDB failed:", tmdbError);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Route 16: GET /api/search-persons
const searchPersons = async (req, res) => {
  const redisClient = req.redisClient;
  const { query = "", page = 1, pageSize = 10 } = req.query;
  if (!query.trim()) return res.status(400).json({ error: "Query parameter is required." });
  const offset = (page - 1) * pageSize;
  const cacheKey = `search_persons_${query.toLowerCase()}_page_${page}_pageSize_${pageSize}`;
  const sqlQuery = `
    SELECT id, profile_path, known_for_department, name
    FROM person_details
    WHERE LOWER(name) LIKE $1
    ORDER BY popularity DESC
    LIMIT $2 OFFSET $3;
  `;
  try {
    const cachedData = await getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log(`Serving search results for query: "${query}" from Redis cache`);
      return res.json(cachedData);
    }
    const data = await connection.query(sqlQuery, [
      `%${query.toLowerCase()}%`,
      parseInt(pageSize),
      offset,
    ]);
    const results = data.rows.map((row) => ({
      id: row.id,
      profile_path: make_picture_url(picture_size, row.profile_path),
      known_for_department: row.known_for_department || "Unknown",
      name: row.name,
    }));
    const response = { results };
    await setCachedData(redisClient, cacheKey, response);
    console.log(`Serving search results for query: "${query}" from database`);
    res.json(response);
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
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
