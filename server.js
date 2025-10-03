const dotenv = require('dotenv');

dotenv.config();
require('./config/databse.js');
const express = require('express');

const app = express();

const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const flash = require('connect-flash');

// Controllers
const authController = require('./controllers/auth.js');

const PORT = '5000';

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));
app.use(flash());

//routes
app.get('/', (req, res) => {
    res.redirect('/pets');
});
app.use('/pets', require('./routes/petRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/favorites', require('./routes/favoriteRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});