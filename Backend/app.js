const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const cookieParser=require('cookie-parser')
const connectDB = require('./db/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('this is ride booking app');
});

module.exports = app;