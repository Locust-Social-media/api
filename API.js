import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('error', err => {
  console.error('MySQL pool error:', err);
});


app.get('/post', (req, res) => {
  pool.query('SELECT * FROM post', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.get('/post/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM post WHERE postID = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post('/post', (req, res) => {
  const { userID, title, bodyText } = req.body;


  if (!userID || !title || !bodyText) {
    return res.status(400).json({ error: 'userID, title and bodyText are required' });
  }

  const sql = 'INSERT INTO post (userID, title, bodyText, likes) VALUES (?, ?, ?, 0)';
  const params = [userID, title, bodyText];

  pool.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: 'Post created',
      postID: results.insertId
    });
  });
});


app.get('/', (req, res) => {
  res.send('API is running');
});


app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
