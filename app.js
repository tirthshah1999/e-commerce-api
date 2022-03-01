require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan"); 

// Connect to DB
const connectDB = require("./db/connect");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const PORT = process.env.PORT || 3000;

// http-logger: e.g: GET / 304 - - 3.076 ms
app.use(morgan("tiny"));

// so we can access json data in req.body while post or put/patch request
app.use(express.json());

app.get("/", (req, res) => {
    res.send("e-commerce api")
})

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