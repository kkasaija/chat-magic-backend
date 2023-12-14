const router = require("express").Router();
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

router.param("user_id", userController.checkId);

router.route("/").get(userController.getUsers);
router
  .route("/:user_id")
  .get(userController.getUser)
  .patch(authController.isOwnProfile, userController.updateUser)
  .delete(authController.isOwnProfile, userController.deleteUser);

module.exports = router;
