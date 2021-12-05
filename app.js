"use Strict";
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
//--------------------database server connction----------------------------//
const dbConnection = async () => {
  const options = {
    serverSelectionTimeoutMS: 3000,
    autoIndex: false,
  };
  return await mongoose.connect(
    "mongodb://localhost:27017/personalBlogDB",
    options
  );
};

dbConnection()
  .then(() => {
    console.log("database service connected successfully");
  })
  .catch((err) => {
    console.error("Error occcured : " + err);
  });

/*-----------Schema Defination-------------------*/

const blogSchema = new mongoose.Schema({
  Title: String,
  Body: String,
});

const blogArticle = mongoose.model("blogarticle", blogSchema);

//-----------------------------------------------------------------------//
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// let posts = [];
app.get("/", (req, res) => {
  blogArticle.find({}, (err, article) => {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: article,
      });
    } else {
      console.error("Error in inserting:" + err);
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app
  .route("/compose")
  .get((req, res) => {
    res.render("compose");
  })

  .post((req, res) => {
    const Article = new blogArticle({
      Title: req.body.postTitle,
      Body: req.body.postBody,
    });
    Article.save((err) => {
      if (!err) {
        console.log("document inserted successfuylly");
        res.redirect("/compose");
      } else {
        console.log("Error in inserting document is " + err);
      }
    });
  });

app.get("/post/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  blogArticle.findById(requestedPostId, (err, fethedArticle) => {
    if (!err) {
      res.render("post", {
        pageTitle: fethedArticle.Title,
        pageBody: fethedArticle.Body,
      });
    }else{
      console.log('post is not available with error :'+err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
