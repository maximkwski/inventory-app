const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
    res.render('index')
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
