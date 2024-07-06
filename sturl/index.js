const express = require("express");
const path=require("path")
const connectToMongoDB = require("./connect");
const urlRoutes = require("./routes/url");
const URL = require("./models/url"); // Import the URL model
const app = express();
const PORT = 2000;
const staticRouter=require("./routes/staticRouter")
connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("mongodb connected");
});
app.set("view engine","ejs");
app.set('views',path.resolve("./views"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/url", urlRoutes);
app.use("/",staticRouter)
app.get("/test", async (req, res) => {
  const allURLs = await URL.find({});
  return res.render('home', {
    urls:allURLs,
  });
  // return res.end(`
  //   <html>
  //     <head></head>
  //     <body>
  //       <ol>
  //         ${allURLs
  //           .map(
  //             (url) =>
  //               `<li>${url.shortId} ${url.redirectURL} ${url.visithistory.length}</li>`
  //           )
  //           .join("")}
  //       </ol>
  //     </body>
  //   </html>
  // `);
});

app.get("/api/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).send({ error: "URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
