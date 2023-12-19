const router = require("express").Router(),
  userController = require("./../Controllers/userController"),
  authController = require("./../Controllers/authController"),
  passwordController = require("./../Controllers/passwordController");

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

router
  .route("/forgotPassword")
  .post(passwordController.forgotPassword);
router
  .route("/:user_id/resetPassword/:token")
  .patch(passwordController.resetPassword);

module.exports = router;
