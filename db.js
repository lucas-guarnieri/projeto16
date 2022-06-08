import pg from 'pg';
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

const user = 'postgres';
const password = process.env.DB_PASSWORD;
const host = 'localhost';
const port = 5432;
const database = 'projeto16';

const connection = new Pool({
  user,
  password,
  host,
  port,
  database
});

const query = connection.query('SELECT * FROM produtos');

query.then(result => {
    console.log(result.rows);
});