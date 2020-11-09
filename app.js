// express app
const path = require("path");
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const rateLimit = require('express-rate-limit');
// const xss = require('xss-clean');
// const hpp = require('hpp');
const cookieParser = require("cookie-parser");
// const compression = require('compression');
const cors = require("cors");
// const passport = require("passport");
// require("./user/passport-setup");
const errorHandler = require("./utils/errorHandler");
const userRouter = require("./user/user.routes");
const commentRouter = require("./comment/comment.routes");
const profileRouter = require("./profile/profile.routes");

const app = express();
// app.set('views', path.join(__dirname, 'views'));
// Global Middlewares
// serve static files
app.use(express.static(path.join(__dirname, "public")));

// app.use("/converse", express.static(path.join(__dirname, "public")));
// cross origin
const origin =
    process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_PROD_URL
        : process.env.FRONTEND_LOCAL_URL;

const corsOptions = {
    credentials: true,
    origin: origin,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// for specific origin
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//     })
// );

// app.options('api/v1/tours/:tourId', cors());

// set security http headers
// app.use(helmet());

// express body parser. reads data from body into req.body
app.use(express.json({ limit: "100kb" }));

// express body parser. reads form data encoded in the url
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// cookie parser. reads data from cookie into req.cookies
app.use(cookieParser());

// app.use(
//     session({
//         secret: process.env.COOKIE_KEY,
//         resave: true,
//         saveUninitialized: true,
//         cookie: { maxAge: 3600000 },
//     })
// );

// data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// data sanitization against XSS
// app.use(xss());

// http parameter pollution
// app.use(
//     hpp({
//         whitelist: [
//             'duration',
//             'maxGroupSize',
//             'ratingsAverage',
//             'difficulty',
//             'price',
//         ],
//     })
// );

// log request info
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// app.use(compression());
// // limit request --- DDoS protection
// const limiter = rateLimit({
//     // 200 request/hour for each ip
//     max: 200,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from this IP address',
// });
// app.use('/api', limiter);

// Initialize Passport and restore authentication state, if any, from the
// session.
// app.use(passport.initialize());
// app.use(passport.session());

// custom middleware
// app.use((req, res, next) => {
//     const cookie = { ...req.cookies };
//     // const query = { ...req.query };
//     console.log(cookie);
//     // console.log(query);
//     // console.log(req.headers.authorization);
//     // console.log("signedCookie:", req.signedCookies);
//     next(); // calling next middleware
// });

// router mounting

app.get("/", (req, res) => {
    res.json({
        message: "Hello user",
    });
});

// entry point to the API
// app.use('/v1/tours', tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/profile", profileRouter);

// entry point to the front-end
// app.use('/', viewRouter);

// fallback route
app.all("/*", (req, res, next) => {
    // const err = new Error(`${req.url} does not exist`);
    // err.statusCode = 404;
    // err.status = 'fail';
    res.status(404).json({
        status: "fail",
        message: `${req.url} does not exist`,
    });
});

// app.all('*', (req, res, next) => {
//     res.status(404).sendFile('404.html', {
//         root: path.join(__dirname, 'public'),
//     });
// });
// global error handling middleware
app.use(errorHandler);

module.exports = app;
