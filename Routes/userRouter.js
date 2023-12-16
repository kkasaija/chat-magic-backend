const router = require("express").Router();
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

router.param("user_id", userController.checkId);

router.route("/").get(authController.protect, userController.getUsers);
router
  .route("/:user_id")
  .get(authController.protect, userController.getUser)
  .patch(
    authController.protect,
    authController.isOwner,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.isOwner,
    userController.deleteUser
  );

module.exports = router;
