const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers
} = require( "../controllers/userControllers" ); // Import your controller functions
const {protect} = require( '../middleware/authMiddleware' );

// Define the routes with the correct callback functions
router.route("/").post(registerUser).get(protect,allUsers); // Route for user registration
router.post("/login", authUser); // Route for user authentication

module.exports = router;
