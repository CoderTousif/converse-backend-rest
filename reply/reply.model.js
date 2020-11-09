const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        commentId: {
            // ref to page -- parent referencing
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: [true, "Comment must belong to a webpage"],
        },
        userId: {
            // ref to User
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Comment must belong to a user"],
            // select: false,
        },
        replyId: {
            // ref to Reply
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply",
        },
        replyName: {
            type: String,
            trim: true,
        },
        opinion: {
            type: String,
            maxlength: 10000,
            required: true,
            trim: true,
        },
        userName: {
            // ref to User
            type: String,
            required: true,
        },
        userPhoto: {
            // ref to User
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("Reply", replySchema);
