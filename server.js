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

// Controllers
const authController = require('./controllers/auth.js');
const petController = require('./controllers/pet.js');
const userController = require('./controllers/user.js');
const favoriteController = require('./controllers/favorite.js');
const PORT = '5000';
const path = require('path');

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});
app.use('/resources', express.static('resources'));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(passUserToView);

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs', { currentUser: req.user});
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/pets', petController);
app.use('/user', userController);
app.use('/favorites', favoriteController);

// Home route


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});