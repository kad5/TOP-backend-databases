#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");
const { faker } = require("@faker-js/faker"); // Updated import

const client = new Client({
  connectionString: process.env.dbString,
});

async function createCountry(name) {
  const result = await client.query(
    "INSERT INTO countries(name) VALUES($1) RETURNING id",
    [name]
  );
  return result.rows[0].id;
}

async function createCity(name, country_id) {
  const result = await client.query(
    "INSERT INTO cities(name, country_id) VALUES($1, $2) RETURNING id",
    [name, country_id]
  );
  return result.rows[0].id;
}

async function createRestaurant(
  name,
  city_id,
  pricing,
  food_category,
  location
) {
  const result = await client.query(
    "INSERT INTO restaurants(name, city_id, pricing, food_category, location, overall_stars) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
    [
      name,
      city_id,
      pricing,
      food_category,
      location,
      Math.floor(Math.random() * 5) + 1,
    ]
  );
  return result.rows[0].id;
}

async function createReview(restaurant_id) {
  const review_stars = Math.floor(Math.random() * 5) + 1;
  const review = faker.lorem.sentence();
  const reviewer_name = faker.person.fullName(); // Updated method
  const likes = Math.floor(Math.random() * 100);
  const dislikes = Math.floor(Math.random() * 100);

  await client.query(
    "INSERT INTO reviews(restaurant_id, review_stars, review, reviewer_name, likes, dislikes) VALUES($1, $2, $3, $4, $5, $6)",
    [restaurant_id, review_stars, review, reviewer_name, likes, dislikes]
  );
}

async function populateDatabase() {
  await client.connect();
  console.log("Seeding...");

  // Populate countries
  const countries = [
    "USA",
    "Canada",
    "Mexico",
    "Brazil",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "India",
    "Japan",
    "Australia",
    "China",
    "Russia",
    "South Korea",
    "UK",
    "Turkey",
    "South Africa",
    "Argentina",
    "Egypt",
    "Thailand",
    "Nigeria",
    "Vietnam",
    "Indonesia",
    "Malaysia",
    "Chile",
    "Greece",
    "Portugal",
    "Netherlands",
    "Belgium",
    "Poland",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Ireland",
    "Switzerland",
    "Austria",
    "New Zealand",
    "Israel",
    "Saudi Arabia",
    "United Arab Emirates",
  ];

  for (let i = 0; i < countries.length; i++) {
    const country_id = await createCountry(countries[i]);

    // Populate cities for each country
    const cities = Array.from(
      { length: 2 + Math.floor(Math.random() * 4) },
      () => faker.location.city() // Updated method
    );
    for (let city of cities) {
      const city_id = await createCity(city, country_id);

      // Populate restaurants for each city
      const numRestaurants = Math.floor(Math.random() * 6) + 4; // between 4 and 10 restaurants per city
      for (let j = 0; j < numRestaurants; j++) {
        const restaurant_name = faker.company.name(); // Updated method
        const pricing = (Math.random() * 50 + 10).toFixed(2); // Random price between 10 and 60
        const food_category = faker.helpers.arrayElement([
          // Updated method
          "american",
          "British",
          "Chinese",
          "Egyptian",
          "Filipino",
          "French",
          "Indian",
          "Indonesian",
          "Italian",
          "Japanese",
          "Lebanese",
          "Mexican",
          "Pakistani",
          "Persian",
          "syrian",
          "Turkish",
        ]);
        const location = faker.location.streetAddress(); // Updated method

        const restaurant_id = await createRestaurant(
          restaurant_name,
          city_id,
          pricing,
          food_category,
          location
        );

        // Create random reviews (0 to 5 reviews)
        const numReviews = Math.floor(Math.random() * 6);
        for (let k = 0; k < numReviews; k++) {
          await createReview(restaurant_id);
        }
      }
    }
  }

  console.log("Seeding done!");
  await client.end();
}

populateDatabase().catch((err) => {
  console.log(process.env.dbPassword);
  console.error("Error during seeding:", err);
  client.end();
});
