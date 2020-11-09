const Profile = require("./profile.model");
// const Website = require("../website/website.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
// const factory = require('./handlerFactory');

exports.createProfile = catchAsync(async (req, res, next) => {
    const { opinion, pageUrl } = req.body;
    //check if websiteid exists
    // get the user name
    console.log(req.body);
    const newProfile = await Profile.create({
        userId: req.user._id,
        profileName: req.user.name,
    });

    // update user profile
    // const updateProfile = await Profile

    res.status(201).json({
        status: "success",
        data: {
            profile: newProfile,
        },
    });
});

exports.getProfile = catchAsync(async (req, res, next) => {
    const doc = await Profile.findOne({ userId: req.params.userId });

    if (!doc) {
        return next(new AppError("Invalid ID. No document found", 404));
    }

    res.status(200).json({
        status: "success",
        data: doc,
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    const { commentId } = req.body;
    const doc = await Profile.findByIdAndUpdate(req.params.profileId, profile, {
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

exports.deleteProfile = catchAsync(async (req, res, next) => {
    const doc = await Profile.findByIdAndDelete(req.params.ProfileId);

    if (!doc) {
        return next(new AppError("Invalid ID. No document found", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getAllProfiles = catchAsync(async (req, res, next) => {
    // to allow nested GET on tour(hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId };
    const { pageUrl } = req.body;
    // { pageUrl: pageUrl }
    const allProfiles = await Profile.find();

    // building the query
    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy');

    // const features = new APIFeatures(Profile.find(filter), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();

    // execute query
    // const docs = await features.query;
    // const docs = await features.query.explain();

    // send response
    res.status(200).json({
        status: "success",
        results: allProfiles.length,
        data: {
            allProfiles,
        },
    });
});
