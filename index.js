const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Database configuration using environment variables from docker-compose
const pool = new Pool({
  user: process.env.DB_USER || 'myuser',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'myappdb',
  password: process.env.DB_PASSWORD || 'mypassword',
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const dbStatus = await pool.query('SELECT NOW()');
    res.send({
      message: 'Hello World! Node.js is running in Docker.',
      database_connection: 'Success',
      db_time: dbStatus.rows[0].now
    });
  } catch (err) {
    res.status(500).send({
      message: 'Hello World! Node.js is running.',
      database_connection: 'Failed',
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
