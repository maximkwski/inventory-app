const pool = require("../db/pool");

// READ - Get all items
exports.getAllItems = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT items.*, categories.name as category_name 
      FROM items 
      JOIN categories ON items.category_id = categories.id 
      ORDER BY items.name
    `);
    res.render("items/list", { items: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching items");
  }
};

// READ - Get single item
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT items.*, categories.name as category_name 
      FROM items 
      JOIN categories ON items.category_id = categories.id 
      WHERE items.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }
    
    res.render("items/detail", { item: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching item");
  }
};

// CREATE - Show form
exports.getCreateForm = async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories ORDER BY name");
    res.render("items/form", {
      item: null,
      categories: categories.rows,
      title: "Add New Item"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading form");
  }
};

// CREATE - Handle submission
exports.createItem = async (req, res) => {
  try {
    const {
      name, description, category_id, price, stock_quantity,
      alcohol_percentage, volume_ml, brand, country_of_origin
    } = req.body;
    
    await pool.query(`
      INSERT INTO items 
      (name, description, category_id, price, stock_quantity, 
       alcohol_percentage, volume_ml, brand, country_of_origin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [name, description, category_id, price, stock_quantity,
        alcohol_percentage, volume_ml, brand, country_of_origin]);
    
    res.redirect("/items");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating item");
  }
};

// UPDATE - Show form
exports.getEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const itemResult = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    const categoriesResult = await pool.query("SELECT * FROM categories ORDER BY name");
    
    if (itemResult.rows.length === 0) {
      return res.status(404).send("Item not found");
    }
    
    res.render("items/form", {
      item: itemResult.rows[0],
      categories: categoriesResult.rows,
      title: "Edit Item"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading form");
  }
};

// UPDATE - Handle submission
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, category_id, price, stock_quantity,
      alcohol_percentage, volume_ml, brand, country_of_origin
    } = req.body;
    
    await pool.query(`
      UPDATE items 
      SET name = $1, description = $2, category_id = $3, price = $4, 
          stock_quantity = $5, alcohol_percentage = $6, volume_ml = $7, 
          brand = $8, country_of_origin = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
    `, [name, description, category_id, price, stock_quantity,
        alcohol_percentage, volume_ml, brand, country_of_origin, id]);
    
    res.redirect(`/items/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating item");
  }
};


// DELETE - Handle deletion
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/items");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting item");
  }
};