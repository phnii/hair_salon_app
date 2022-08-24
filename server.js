const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const layouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const errorHandler = require("./utils/errorResponse");

const getCurrentUser = require("./middleware/currentUser");

// Route files
const auth = require("./routes/auth");
const menus = require("./routes/menus");

// load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);


// Body Parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(getCurrentUser);

// Mount routers
app.use("/auth", auth);
app.use("/menus", menus);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1))
})