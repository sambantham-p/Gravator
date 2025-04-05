const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/database');
const userRouter = require('./routers/user.route');
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.get('/', (req, res) => res.send('Hello World'));
connectDB();
app.use('/', userRouter);
app.listen(PORT, console.log('Server is running on port: ' + PORT));
