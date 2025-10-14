const express = require("express");
const app = express();
const path = require("path");


const indexRouter = require("./routes/index");
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", indexRouter);
app.use("/categories", categoryRoutes);
app.use("/items", itemRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`🍺 Liquor Store Inventory listening on port ${PORT}!`);
});
