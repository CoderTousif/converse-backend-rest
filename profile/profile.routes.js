const router = require("express").Router({ mergeParams: true });
const profileCtrl = require("./profile.controller");
const authCtrl = require("../user/auth.controller");

router.use(authCtrl.protect);

router.get("/:userId", profileCtrl.getProfile);

module.exports = router;
