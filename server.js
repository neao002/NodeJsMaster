// Declaration
const express = require("express");
const app = express();
// import dotenv configuaration
require("dotenv").config();
const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

// multer

const multer = require("multer");

const storage = multer.diskStorage({
  // where to upload
  destination: function (req, file, callback) {
    callback(null, "public/uploads");
  },
  // giving a file name as we want
  filename: function (req, file, callback) {
    callback(null, file.originalname + -"-" + Date.now());
  },
});
const upload = multer({
  storage: storage,
  limits: { filesize: 10 },
});

// session

const session = require("express-session");
// Custom Helper
const hbs = require("hbs");
hbs.registerHelper("capital", (username) => {
  return username.toUpperCase() + "Ahmad";
});

hbs.registerHelper("ifEqual", (arg1, arg2, option) => {
  return arg1 == arg2 ? option.fn(this) : option.inverse(this);
  //    if(arg1 == arg2) {
  //        return option.fn(this)
  //    }
  //    else {
  //        return option.inverse(this)
  //    }
});

/**
 * process.env means in the machine processes has an environment
 * process.env.PORT means this process environment has a variable called PORT
 */
const PORT = process.env.PORT;

// Mongodb connection using mongoose module
const mongoose = require("mongoose");
const DB_NAME = process.env.DB_NAME;
const DB_LINK = process.env.MONGO_LINK + DB_NAME;
mongoose
  .connect(DB_LINK, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB database is Successfully connected"))
  .catch(() => console.log("Database connection failed!"));

// Settings
// express session setting
app.use(
  session({
    secret: process.env.MY_SECRET, // signature
    cookie: {
      // set the time for session data
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing

const User = require("./models/User");
// test mongoose query methods
app.get("/searchByName", (req, res) => {
  //res.json('test ok') // check route test ok
  // req.body.name
  User.findOne({ name: "Jose" }, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
/**
 * Error Route handler
 * only runs when no other routes matches
 * asteric(*) means any routes
 */

// faking data
const faker = require("faker");

app.get("/test/fakeData", (req, res) => {
  const email = faker.internet.email();
  const secondName = faker.name.firstName();
  const image = faker.image.cats();
  const country = faker.address.city();
  const adress = faker.address.streetAddress();
  const password = faker.internet.password();

  const userData = {
    name: {
      Email: email,
      secondName: secondName,
      image: image,
      country: country,
      adress: adress,
      password: password,
    },
  };

  res.render("fakerData", { userData });
});

// uploading fotos

app.get("/uploadForm", (req, res) => {
  res.render("fileformupload");
});

app.post("/upload/file", upload.single("fileToUpload"), (req, res, err) => {
  res.render("fileformupload", { picture: req.file.filename });
});

//error 404
app.get("*", (req, res) => {
  res.render("error");
});

// listen app with port
app.listen(PORT, () => {
  console.log("Server is running...");
});
