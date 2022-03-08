require("dotenv").config();
require('express-async-errors');

const express = require("express");
const app = express();
const morgan = require("morgan"); 
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

// Connect to DB
const connectDB = require("./db/connect");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const {authenticatedUser} = require("./middleware/authentication");

const PORT = process.env.PORT || 3000;

// http-logger: e.g: GET / 304 - - 3.076 ms
app.use(morgan("tiny"));


// so we can access json data in req.body while post or put/patch request
app.use(express.json());

// grab the cookie which browser is providing
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
    res.send("e-commerce api")
})

app.get("/api/v1", (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send("e-commerce api")
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticatedUser, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();