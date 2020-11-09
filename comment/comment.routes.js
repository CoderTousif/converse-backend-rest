const router = require("express").Router({ mergeParams: true });
const commentCtrl = require("./comment.controller");
const authCtrl = require("../user/auth.controller");
const replyCtrl = require("../reply/reply.controller");
const { param, body, validationResult } = require("express-validator");

router.route("/").get(commentCtrl.getAllComments);

router.route("/:commentId/replies").get(replyCtrl.getAllReplies);

// router.use(passport.authorize);
router.use(authCtrl.protect);

router.post(
    "/",
    [
        body("opinion").not().isEmpty().trim().escape(),
        body("pageUrl").isLength({ min: 3 }),
    ],
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    },
    commentCtrl.createComment
);

router.patch(
    "/",
    [
        body("opinion").not().isEmpty().trim().escape(),
        body("pageUrl").isLength({ min: 3 }),
    ],
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    commentCtrl.updateComment
);

router.patch(
    "/:commentId",
    [body("liked").isBoolean()],
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    commentCtrl.likeComment
);
router.delete("/:commentId", commentCtrl.deleteComment);

router.route("/:commentId/replies").post(replyCtrl.createReply);

router
    .route("/:commentId/replies/:replyId")
    .post(replyCtrl.createReply)
    .patch(replyCtrl.likeReply)
    .delete(replyCtrl.deleteReply);

module.exports = router;
