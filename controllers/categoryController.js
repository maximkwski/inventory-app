const pool = require("../db/pool");

// READ - Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.render("categories/list", { categories: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching categories");
  }
};

// READ - Get single category with its items
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const categoryResult = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    
    const itemsResult = await pool.query(
      "SELECT * FROM items WHERE category_id = $1 ORDER BY name",
      [id]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    
    res.render("categories/detail", {
      category: categoryResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching category");
  }
};

// CREATE - Show form
exports.getCreateForm = (req, res) => {
  res.render("categories/form", { category: null, title: "Create Category" });
};

// CREATE - Handle submission
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2)",
      [name, description]
    );
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating category");
  }
};

// UPDATE - Show form
exports.getEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }
    
    res.render("categories/form", {
      category: result.rows[0],
      title: "Edit Category"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching category");
  }
};

// UPDATE - Handle submission
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
      [name, description, id]
    );
    
    res.redirect(`/categories/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating category");
  }
};

// DELETE - Handle deletion
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting category");
  }
};