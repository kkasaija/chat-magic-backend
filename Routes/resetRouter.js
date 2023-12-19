const router = require("express").Router();
const passwordController = require("./../Controllers/passwordController");

router.route("/forgotPassword").post(passwordController.forgotPassword);
router.route("/resetPassword/:token").patch(passwordController.resetPassword);

module.exports = router;
