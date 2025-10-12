const pool = require("./pool");

async function populateDatabase() {
  try {
    console.log("Adding sample data...");
    
    // Insert categories
    const categories = await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Beer', 'Fermented beverages made from grains, hops, yeast, and water'),
      ('Wine', 'Alcoholic beverages made from fermented grapes or other fruits'),
      ('Liquor', 'Distilled spirits with higher alcohol content')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name;
    `);
    
    console.log("Categories added:", categories.rows);
    
    // Get category IDs
    const catResult = await pool.query("SELECT id, name FROM categories ORDER BY id");
    const catMap = {};
    catResult.rows.forEach(cat => {
      catMap[cat.name] = cat.id;
    });
    
    // Insert sample items
    await pool.query(`
      INSERT INTO items (name, description, category_id, price, stock_quantity, alcohol_percentage, volume_ml, brand, country_of_origin) VALUES
      -- Beers
      ('Heineken Lager', 'Premium Dutch lager with a crisp, clean taste', $1, 12.99, 48, 5.0, 330, 'Heineken', 'Netherlands'),
      ('Guinness Draught', 'Classic Irish stout with creamy texture', $1, 14.99, 36, 4.2, 440, 'Guinness', 'Ireland'),
      ('Corona Extra', 'Light Mexican lager, perfect with lime', $1, 11.99, 60, 4.5, 355, 'Corona', 'Mexico'),
      
      -- Wines
      ('Chateau Margaux 2015', 'Elegant Bordeaux red wine', $2, 299.99, 12, 13.5, 750, 'Chateau Margaux', 'France'),
      ('Cloudy Bay Sauvignon Blanc', 'Crisp New Zealand white wine', $2, 24.99, 24, 13.0, 750, 'Cloudy Bay', 'New Zealand'),
      ('Moet & Chandon Champagne', 'Luxurious French sparkling wine', $2, 54.99, 18, 12.5, 750, 'Moet & Chandon', 'France'),
      
      -- Liquors
      ('Grey Goose Vodka', 'Premium French vodka, smooth and refined', $3, 39.99, 30, 40.0, 750, 'Grey Goose', 'France'),
      ('Johnnie Walker Black Label', 'Rich and smooth Scotch whisky', $3, 44.99, 28, 40.0, 700, 'Johnnie Walker', 'Scotland'),
      ('Bacardi Superior Rum', 'Light and mixable white rum', $3, 19.99, 45, 40.0, 750, 'Bacardi', 'Puerto Rico'),
      ('Patron Silver Tequila', 'Premium 100% agave tequila', $3, 49.99, 20, 40.0, 750, 'Patron', 'Mexico')
    `, [catMap['Beer'], catMap['Wine'], catMap['Liquor']]);
    
    console.log("✅ Sample data added successfully!");
    
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await pool.end();
  }
}

populateDatabase();