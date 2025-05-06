const dotenv = require('dotenv');
dotenv.config(); // set up dotenv configuration to load environment variables from .env file
// Import neccessary modules
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./config/db') // import the database connection 
const userRoute = require('./routes/userRoute'); // import user related routes


const app = express(); 

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 10 * 60 * 1000,
    }
}));
app.use(express.json()) // parse incomming request for JSON paload

// routes
app.use('/api/auth', userRoute)

const port = process.env.PORT; // load the port from .env file

// start the server and listen to the define port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})