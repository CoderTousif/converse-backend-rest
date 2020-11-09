const Comment = require("./comment.model");
const Profile = require("../profile/profile.model");
// const Website = require("../website/website.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
// const factory = require('./handlerFactory');

exports.createComment = catchAsync(async (req, res, next) => {
    const { opinion, pageUrl } = req.body;
    //check if websiteid exists
    // get the user name
    const newComment = await Comment.create({
        opinion,
        pageUrl,
        userId: req.user._id,
        userName: req.user.name,
        userPhoto: req.user.photo,
    });

    await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
            $push: { comments: newComment._id },
        }
    );
    // update user profile
    // const updateProfile = await Profile.

    res.status(201).json({
        status: "success",
        data: newComment,
    });
});

exports.likeComment = catchAsync(async (req, res, next) => {
    const { liked } = req.body;
    const { commentId } = req.params;

    let likedComment;

    if (liked) {
        // { userId: req.user._id },
        // let profile = await Profile.findOne({
        //     likedComments: { userId: req.user._id },
        // });

        // if (profile) {
        //     console.log(profile);
        //     res.status(406);
        // }

        likedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        await Profile.findOneAndUpdate(
            { userId: req.user._id },
            {
                $push: { likedComments: likedComment._id },
            }
        );
    } else {
        likedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { likes: -1 } },
            { new: true }
        );

        await Profile.findOneAndUpdate(
            { userId: req.user._id },
            {
                likedComments: likedComment._id,
            }
        );
    }

    res.status(201).json({
        status: "success",
        data: likedComment,
    });
});

exports.updateComment = catchAsync(async (req, res, next) => {
    const { comment } = req.body;
    const doc = await Comment.findByIdAndUpdate(req.params.commentId, comment, {
        new: true,
        // update does not run validators by default
        runValidators: true,
    });

    if (!doc) {
        return next(new AppError("Invalid ID. No document found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            doc,
        },
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const doc = await Comment.findById(req.params.commentId);
    if (!doc) {
        return next(new AppError("Invalid ID. No document found", 404));
    }

    if (`${doc.userId}` === `${req.user._id}`) {
        await Comment.findByIdAndDelete(req.params.commentId);
    } else {
        res.status(406);
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
    // to allow nested GET on tour(hack)
    let filter = {};
    if (req.params.pageUrl) filter = { pageUrl: req.params.pageUrl };

    // TODO: Add a feature that sort by user comments if there's any
    // let token;
    // if (req.cookies.jwt) token = req.cookies.jwt;

    const allComments = await Comment.find();

    // building the query
    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy');

    const features = new APIFeatures(Comment.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // execute query
    const docs = await features.query;
    // const docs = await features.query.explain();

    // send response
    res.status(200).json({
        status: "success",
        results: allComments.length,
        data: docs,
    });
});
