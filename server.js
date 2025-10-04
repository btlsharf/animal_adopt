const dotenv = require('dotenv');
dotenv.config();

require('./config/databse.js');

const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Controllers
const authController = require('./controllers/auth.js');
const petController = require('./controllers/pet.js');
const userController = require('./controllers/user.js');
const favoriteController = require('./controllers/favorite.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// MIDDLEWARE

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/resources', express.static('resources'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.session?.user || null;
  next();
});

app.use(passUserToView);

// ROUTES 

app.get('/', (req, res) => {
  res.render('index.ejs', { currentUser: req.session?.user || null });
});

app.use('/auth', authController);
app.use('/pets', petController);
app.use(isSignedIn);
app.use('/users', userController);
app.use('/favorites', favoriteController);

// START SERVER

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
