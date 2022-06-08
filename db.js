import pg from 'pg';
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

const user = 'postgres';
const password = process.env.DB_PASSWORD;
const host = process.env.HOST;
const port = 5432;
const database = 'projeto16';

const connection = new Pool({
  user,
  password,
  host,
  port,
  database
});


export default connection;