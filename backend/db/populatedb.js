#! /usr/bin/env node

const { Client } = require("pg");

/*
Restaurants Table:
id, name, city_id, pricing, food_category, location, overall stars

Cities Table:
id, name, country_id

Countries Table:
id, name

Reviews Table:
id, restaurant_id, review_stars, review, reviewer_name, likes, dislikes

suggestions table:
id, related_to, suggestion
*/

const SQL = `
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  country_id INTEGER,
  FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  city_id INTEGER,
  pricing DECIMAL(4, 2),
  food_category VARCHAR(255),
  location VARCHAR(255),
  overall_stars INTEGER,
  FOREIGN KEY (city_id) REFERENCES cities (id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER,
  review_stars INTEGER,
  review VARCHAR(255),
  reviewer_name VARCHAR(255),
  likes INTEGER,
  dislikes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.dbString,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
