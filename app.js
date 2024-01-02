require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB=require('./server/config/db');
const cookieParser = require('cookie-parser'); // saves up each session so that we wont be loginning each time.
const MongoStore = require('connect-mongo');
const session = require('express-session');
const methodOverride=require('method-override');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
