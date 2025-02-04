const pool = require("./pool");

async function getMain() {
  try {
    const randomRes = await pool.query(
      `SELECT * FROM restaurants ORDER BY RANDOM() LIMIT 1`
    );
    const featuredRes = randomRes ? randomRes.rows[0] : null;

    const randomCity = await pool.query(
      `SELECT * FROM cities ORDER BY RANDOM() LIMIT 1`
    );

    const featuredCity = randomCity ? randomCity.rows[0] : null;

    const resNum = await pool.query(
      `SELECT COUNT(*) FROM restaurants WHERE city_id = $1`,
      [featuredCity.id]
    );
    const resCount = resNum.rows[0].count;

    const citynum = await pool.query(`SELECT COUNT(*) FROM cities;`);

    return { featuredRes, featuredCity, resCount, citynum };
  } catch (error) {
    console.log(error);
  }
}

async function getAll() {
  try {
    const allCities = await pool.query(`SELECT * FROM cities`);
    return allCities.rows;
  } catch (error) {
    console.log(error);
  }
}

async function fetchEach(city) {
  try {
    const resNums = await pool.query(
      `SELECT COUNT(*) FROM restaurants WHERE city_id = $1`,
      [city.id]
    );
    const resCount = resNums.rows[0].count;

    const countryRow = await pool.query(
      `SELECT name FROM country WHERE id = $1`,
      [city.country_id]
    );
    const country = countryRow.rows[0].name;

    return { resCount, country };
  } catch (error) {
    console.log(error);
  }
}

async function citySearch(city) {
  try {
    const { id, name, country_id } = city;
    const restaurantsRes = await pool.query(
      "SELECT * FROM restaurants WHERE city_id = $1",
      [id]
    );

    const countryRes = await pool.query(
      "SELECT name FROM countries WHERE id = $1",
      [country_id]
    );

    const countryName = countryRes.rows[0]?.name;
    const restaurants = restaurantsRes.rows;

    return { id, type: "city", name, countryName, restaurants };
  } catch (error) {
    console.log(error);
  }
}

async function searchTables(searchTerm) {
  try {
    const cityRes = await pool.query("SELECT * FROM cities WHERE name = $1", [
      searchTerm,
    ]);

    if (cityRes.rows.length > 0) {
      const city = cityRes.rows[0];
      const cityData = await citySearch(city);
      return cityData;
    }

    const countryRes = await pool.query(
      "SELECT * FROM countries WHERE name = $1",
      [searchTerm]
    );

    if (countryRes.rows.length > 0) {
      const country = countryRes.rows[0];
      const { id, name } = country;

      const citiesRes = await pool.query(
        "SELECT * FROM cities WHERE country_id = $1",
        [id]
      );

      let restaurants = [];
      for (const city of citiesRes.rows) {
        const cityData = await citySearch(city);
        restaurants = [...restaurants, ...cityData.restaurantsArr];
      }

      return { id, type: "country", name, restaurants };
    }

    return { type: "No city or country found matching the search term." };
  } catch (err) {
    console.error(err);
  }
}

async function restaurant(id) {
  try {
    const restaurant = await pool.query(
      `SELECT * FROM restaurants WHERE id = $1`,
      [id]
    );
    if (restaurant.rows.length < 1) return null;
    return restaurant.rows[0];
  } catch (err) {
    console.error(err);
  }
}

async function reviews(id) {
  try {
    const reviews = await pool.query(
      `SELECT * FROM reviews WHERE restaurant_id = $1`,
      [id]
    );
    if (reviews.rows.length < 1) return null;
    return reviews.rows;
  } catch (err) {
    console.error(err);
  }
}

async function addReview(data) {
  try {
    const { id, revName, revBody, rating } = data;
    await pool.query(
      `INSERT INTO reviews (restaurant_id, review_stars, review, reviewer_name, likes, dislikes) 
        VALUES
        (($1), ($2), ($3), ($4))`,
      [id, rating, revBody, revName, 1, 0]
    );

    const restaurantRevs = await reviews(id);
    if (restaurantRevs) {
      let totalRating = 0;
      restaurantRevs.forEach((rev) => {
        totalRating += rev.review_stars;
      });

      let averageRating = totalRating / restaurantRevs.length;
      averageRating = Math.round(averageRating / 5) * 5;
      if (averageRating > 50) averageRating = 50;
      if (averageRating < 0) averageRating = 0;

      await pool.query(
        `UPDATE restaurants
         SET overall_stars = $1
         WHERE id = $2`,
        [averageRating, id]
      );
    }
  } catch (err) {
    console.error(err);
  }
}

async function like(reviewId) {
  try {
    await pool.query(
      `UPDATE reviews
       SET likes = likes + 1
       WHERE id = $1`,
      [reviewId]
    );
  } catch (err) {
    console.error("Error updating dislikes:", err);
  }
}

async function dislike(reviewId) {
  try {
    await pool.query(
      `UPDATE reviews
       SET dislikes = dislikes + 1
       WHERE id = $1`,
      [reviewId]
    );
  } catch (err) {
    console.error("Error updating dislikes:", err);
  }
}

module.exports = {
  getMain,
  getAll,
  fetchEach,
  searchTables,
  restaurant,
  reviews,
  addReview,
  like,
  dislike,
};
