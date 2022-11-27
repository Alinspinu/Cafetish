if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate')
const session =require('express-session')
const flash =require('connect-flash');
const User = require('./models/user');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary');
const upload = multer({storage});
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utilities/expressError')
const helmet = require('helmet')
const MongoDbStore = require('connect-mongo');


const meniuRoutes = require('./routes/meniu')
const comandaRoutes = require('./routes/comanda')
const userRoutes = require('./routes/user')



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Cafetish';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))



const sessionConfig = {
    store: MongoDbStore.create({
        mongoUrl: dbUrl,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    }
}

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css', 
    "https://api.mapbox.com/",
    "https://kit-free.fontawesome.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            frameSrc: ["'self'", "blob:", "data:", "https://www.youtube.com",],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhetxk68c/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(flash());

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.flowerpower = 1;
    res.locals.autUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res)=>{
    res.render('index')
})
app.use('/meniu', meniuRoutes);
app.use('/comanda', comandaRoutes);
app.use('/user', userRoutes);



// app.all('*', (err, req, res, next) => {
//     next(new ExpressError('page not found', 404))
// })

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'O Noo! Something went wrong!'
    res.status(statusCode).render('error',{err}) 
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})