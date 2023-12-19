const router = require("express").Router(),
  authController = require("./../Controllers/authController");

router.route("/signin").post(authController.signIn);
router.route("/signout").get(authController.signOut);
router.route("/register").post(authController.register);

module.exports = router;
