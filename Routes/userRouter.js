const router = require("express").Router();
const userController = require("./../Controllers/userController");

router.route("/").get(userController.getUsers);
router
  .route("/:user_id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
