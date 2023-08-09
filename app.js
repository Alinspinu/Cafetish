if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const Produs = require("./models/produs");
const Cart = require("./models/cart");
const Comanda = require("./models/order");
const multer = require("multer");
const { storage, cloudinary } = require("./cloudinary");
const upload = multer({ storage });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FbStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExpressError = require("./utilities/expressError");
const helmet = require("helmet");
const MongoDbStore = require("connect-mongo");

const meniuRoutes = require("./routes/meniu");
const comandaRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const legalRoutes = require("./routes/legal");
const blogRoutes = require("./routes/blog");
const recipeRoutes = require("./routes/recipe")
const posRoutes = require("./routes/pos")
const apiRoutes = require("./routes/api")
const bodyParser = require('body-parser')

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl);

const cors = require('cors')

app.use(cors())

app.set('trust proxy', true);



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
// const { MailtrapClient } = require("mailtrap");

const sessionConfig = {
  store: MongoDbStore.create({
    mongoUrl: dbUrl,
    autoRemove: "interval",
    autoRemoveInterval: 10,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};



const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://code.jquery.com",
  "https://js.stripe.com/v3/",
  "https://connect.facebook.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css",
  "https://api.mapbox.com/",
  "https://kit-free.fontawesome.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const fontSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://fonts.gstatic.com",
  "https://cdn.jsdelivr.net",
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      mediaSrc: ["https://res.cloudinary.com/", "http://localhost:8080/", "https://www.cafetish.com"],
      connectSrc: [
        "http://localhost:8080/order/order-done",
        "https://www.cafetish.com/order/order-done",
        "http://localhost:8080/",
        "https://cafetish.com",
        "https://connect.facebook.net",
        "https://www.facebook.com",
        "https://www.cafetish.com",
      ],
      formAction: ["'self'", "https://checkout.stripe.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      frameSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://www.youtube.com",
        "https://js.stripe.com",
        "https://www.facebook.com",
      ],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dhetxk68c/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://q.stripe.com",
        "https://api.qrserver.com",
        "https://www.facebook.com",
        "https://platform-lookaside.fbsbx.com",
        "https://lh3.googleusercontent.com/",
        "https://upload.wikimedia.org",
        "https://s3-us-west-2.amazonaws.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(flash());

app.use(bodyParser.json());
app.use(session(sessionConfig));

app.disable("etag");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new FbStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.AUTH_CALLBK_URL_BASE}FbLogin`,
      profileFields: ["name", "email", "picture", "displayName"],
    },
    function (accessToken, refreshToken, profile, cb) {
      const newUser = User.findOrCreate(
        {
          facebookId: profile.id,
          onlineName: profile.displayName,
          email: profile.emails[0].value,
        },
        function (err, user) {
          if (user.onlinePic) {
            return cb(err, user);
          } else {
            user.onlinePic = profile.photos[0].value;
            user.save();
          }
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.AUTH_CALLBK_URL_BASE}gogLogin`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          onlineName: profile.displayName,
          email: profile.emails[0].value,
          onlinePic: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.flowerpower = 1;
  res.locals.autUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.session = req.session;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/meniu", meniuRoutes);
app.use("/order", comandaRoutes);
app.use("/user", userRoutes);
app.use("/legal", legalRoutes);
app.use("/blog", blogRoutes);
app.use("/recipes", recipeRoutes)
app.use("/pos", posRoutes)
app.use("/api", apiRoutes)

// const TOKEN = "ff997ac8b798cceaa766fee1a78e30e7";
// const ENDPOINT = "https://send.api.mailtrap.io/";

// const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

// const sender = {
//   email: "office@cafetish.com",
//   name: "Notificare",
// };
// const recipients = [
//   {
//     email: "alinz.spinu@gmail.com",
//   }
// ];

// app.get('/sendMail', (req,res) => {
//     client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
//   res.redirect('/meniu')

// })

// app.all('*', (err, req, res, next) => {
//     next(new ExpressError('page not found', 404))
// })

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "O Noo! Something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
