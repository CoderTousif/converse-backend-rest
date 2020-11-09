const router = require("express").Router({ mergeParams: true });
const userCtrl = require("./user.controller");
const authCtrl = require("./auth.controller");
const { param, body, validationResult } = require("express-validator");

// const passport = require("passport");

// auth
// router.get("/google", (req, res) => {
//     res.json({ message: "google auth hit" });
//     // authCtrl.authenticateGoogle;
// });

// router.get(
//     "/facebook",
//     passport.authenticate("facebook", {
//         session: false,
//         assignProperty: "user",
//     })
// );

// router.get(
//     "/facebook/redirect",
//     passport.authenticate("facebook", {
//         failureRedirect: "/login",
//     }),
//     (req, res) => {
//         res.cookie("accessId", req.user._id, { maxAge: 900000 });
//         res.json({ user: req.user });
//     }
// );
router.post("/login/facebook", authCtrl.facebook);

router.get("/twitter", (req, res) => {
    res.json({ message: "twitter auth hit" });
    // authCtrl.authenticateTwitter;
});

// router.get("/google/redirect", (req, res) => {
//     res.status(200).json({ message: "Redirect hit" });
// });

// router.get("/twitter/redirect", (req, res) => {
//     res.status(200).json({ message: "Redirect hit" });
// });

router.post(
    "/signup",
    [
        body("email").isEmail(),
        body("password").isLength({ min: 10 }),
        body("confirmPassword").isLength({ min: 10 }),
    ],
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:
                    'Please provide a valid "email", "password" and "confirmPassword" of minimum 10 characters',
            });
        }

        next();
    },
    authCtrl.signup
);

router.post(
    "/login",
    [body("email").isEmail(), body("password").isLength({ min: 10 })],
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:
                    'Please provide a valid "email" and "password" of minimum 10 characters',
            });
        }

        next();
    },
    authCtrl.login
);

router.get("/logout", authCtrl.logout);

router.post("/forgot-password", authCtrl.forgotPassword);
router.patch("/reset-password/:resetToken", authCtrl.resetPassword);

router.use(authCtrl.protect);
// all routes from this line is protected by authCtrl.protect middleware
// and user info is loaded into req.user

router.patch("/update-password", authCtrl.updatePassword);
router.patch(
    "/update-me",
    userCtrl.uploadUserPhoto,
    userCtrl.resizeUserPhoto,
    userCtrl.updateMe
);

router.patch("/deactivate-me", userCtrl.deactivateMe);
router.delete("/delete-me", userCtrl.deleteMe);
router.get("/account", userCtrl.getMe, userCtrl.getUser);

// restricted to admin
// router.use(authCtrl.restrictTo("admin"));

router.route("/").get(userCtrl.getAllUsers).post(userCtrl.createUser);

router
    .route("/:id")
    .get(userCtrl.getUser)
    .patch(userCtrl.updateUser)
    .delete(userCtrl.deleteUser);

module.exports = router;
