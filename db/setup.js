const pool = require("./pool");

async function setubDatabase() {
    try {
        console.log("Creating tables...");

        //create categories table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        //create items table
        await pool.query(`
           CREATE TABLE IF NOT EXISTS items (
                id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category_id INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                stock_quantity INT DEFAULT 0,
                alcohol_percentage DECIMAL (4, 2),
                volume_ml INT,
                brand VARCHAR(100),
                country_of_origin VARCHAR(100),
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
           ); 
        `);

        // Create indexes
        await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
        `);
        
        await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
        `);

        console.log("✅ Tables created successfully!")

    } catch (err) {
        console.log("Error setting up database: ", err)
    } finally {
        await pool.end();
    }
}

setubDatabase();