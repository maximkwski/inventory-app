const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// READ routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// CREATE routes
router.get("/new", categoryController.getCreateForm); 
router.post("/", categoryController.createCategory); 

// UPDATE routes
router.get("/:id/edit", categoryController.getEditForm);
router.post("/:id/update", categoryController.updateCategory);

// DELETE route
router.post("/:id/delete", categoryController.deleteCategory);

module.exports = router;
