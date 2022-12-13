//jshint esversion:6

const express = require("express");
const dotenv = require("dotenv");
const _ = require("lodash");
const mongoose = require("mongoose");

// ENVIRONMENT
dotenv.config();

//  EXPRESS CONFIGS

const app = express();

// --TEMPLATING

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- CONSTANTS ---

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const port = process.env.PORT || 3000;
const posts = [];
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbEndpoint = process.env.DB_ENDPOINT;
const dbName = "blog";

// --- DATABASE ---
const url = `mongodb+srv://${dbUser}:${dbPass}@${dbEndpoint}/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Succesfully connected to database.");
}).catch(e => {
  console.log(e);
});

const postSchema = mongoose.Schema({
  title: String,
  content: String,
  url: String,
});

const Post = mongoose.model("post", postSchema);

// --- PAGES ---

app.get("/", (req, res) => {
  Post.find({}, (e, docs) => {
    if (!e) {
      res.render("home", {
        homeContent: homeStartingContent,
        posts: docs,
      });

    } else {
      console.log(e);
      res.render("home", {
        homeContent: homeStartingContent,
        posts: posts,
      });
    };
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  // Create new post document
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postText,
    url: _.kebabCase(req.body.postTitle),
  })

  // Save post
  post.save().then(() => {
    console.log("Post added to database.")
    res.redirect("/");
  }).catch(e => {
    console.log("e");
    res.redirect("/compose");
  });
});

app.get("/posts/:postId", (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (!err) {
      console.log(`Serving post ${post._id}.`)
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      res.render("404");
    };
  });
});


// LISTENING

app.listen(port, function () {
  console.log(`Server started on port ${port}.`);
});
