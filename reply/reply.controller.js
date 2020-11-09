const handlerFactory = require("../utils/handlerFactory");
const Reply = require("./reply.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Comment = require("../comment/comment.model");
const Profile = require("../profile/profile.model");

// get all replies of a comment. comment id sent via params
exports.getAllReplies = handlerFactory.getAll(Reply);

// add a reply of a comment
exports.createReply = catchAsync(async (req, res, next) => {
    const { opinion, pageUrl } = req.body;
    const { commentId, replyId } = req.params;
    // replyId is for reply of a reply
    //check if websiteid exists
    // get the user name
    console.log(req.body);

    const newReply = await Reply.create({
        commentId,
        opinion,
        pageUrl,
        replyId,
        userId: req.user._id,
        userName: req.user.name,
        userPhoto: req.user.photo,
    });

    await Comment.findByIdAndUpdate(commentId, { $inc: { replies: 1 } });
    await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
            $push: { repliedComments: newReply._id },
        }
    );

    // update user profile
    // const updateProfile = await Profile.

    res.status(201).json({
        status: "success",
        data: newReply,
    });
});

//get a reply
exports.getReplies = handlerFactory.getOne(Reply);

// delete reply
exports.deleteReply = catchAsync(async (req, res, next) => {
    const { commentId, replyId } = req.params;

    const doc = await Reply.findByIdAndDelete(replyId);

    if (!doc) {
        return next(new AppError("Invalid ID. No document found", 404));
    }

    await Comment.findByIdAndUpdate(commentId, { $inc: { replies: -1 } });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.likeReply = catchAsync(async (req, res, next) => {
    const { replyId, liked } = req.body;
    let likedReply = {};

    if (liked) {
        likedReply = await Reply.findByIdAndUpdate(
            replyId,
            { $inc: { likes: 1 } },
            { new: true }
        );
    } else if (!liked) {
        likedReply = await Reply.findByIdAndUpdate(
            replyId,
            { $inc: { likes: -1 } },
            { new: true }
        );
    }

    res.status(201).json({
        status: "success",
        data: likedReply,
    });
});
