// routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// CREATE routes
router.get("/new", itemController.getCreateForm);
router.post("/", itemController.createItem);

// READ routes
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);                 



// UPDATE routes
router.get("/:id/edit", itemController.getEditForm);
router.post("/:id/update", itemController.updateItem);

// DELETE route
router.post("/:id/delete", itemController.deleteItem); 

module.exports = router;