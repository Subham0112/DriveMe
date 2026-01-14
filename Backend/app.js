const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.route');
const cors = require('cors');
const cookieParser=require('cookie-parser')
const connectDB = require('./db/db');
connectDB();

const app = express();

app.use(cors({
  origin: true, // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

app.get('/', (req, res) => {
  res.send('this is ride booking app');
});

module.exports = app;