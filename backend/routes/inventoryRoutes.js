const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventoryController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, controller.addItem);
router.get("/", authenticate, controller.getItems);
router.put("/:id", authenticate, controller.updateItem);
router.delete("/:id", authenticate, controller.deleteItem);

module.exports = router;
