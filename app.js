const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts = [];
const port = (process.env.PORT || 3002);

// connect with mongo
mongoose.connect("mongodb+srv://BunnyBites:BXLWLowi4E8tSd8R@devsandbox.q082xah.mongodb.net/blogDB")
.then(() => console.log("Mongo connection successfull!"));

// create post schema
const blogPostSchema = new mongoose.Schema({
  pageName: String,
  pageDescription: String,
  posts: [{ title: String, description: String }]
});

// create blog post modal
const Blog = new mongoose.model("Blog", blogPostSchema);

app.get('/', (req, res) => {
  Blog.findOne({ pageName: "Home" })
  .then((result) => {
    if (result) {
      res.render("home", { pageDescription: result.pageDescription, posts: result.posts })
    } else {
      Blog.create({ pageName: "Home", pageDescription: homeStartingContent, posts: [] })
        .then(() => res.redirect("/"));
    }
  })
});

// about section
app.get('/about', (req, res) => {
  res.render("about", { pageDescription: aboutContent});
});

// contact section
app.get('/contact', (req, res) => {
  res.render("contact", { pageDescription: contactContent });
});

// compose section
app.get('/compose', (req, res) => {
  res.render("compose");
});

app.post('/compose', (req, res) => {
  const { title, description } = req.body;

  posts.push({ title, description });

  res.redirect('/');
})

// new post
app.get("/post/:name", (req, res) => {
  const { name } = req.params;
  const preparedName = _.lowerCase(name);

  const postForTheProvidedName = posts.filter((post) => _.lowerCase(post.title) === preparedName);

  if (postForTheProvidedName.length) {
    res.render("post", { ...postForTheProvidedName[0] })
  }
});

app.listen(port, () => console.log("Server running on port " + port))
