const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Comment = require("../comment/comment.model");
const User = require("../user/user.model");
const Reply = require("../reply/reply.model");
const Profile = require("../profile/profile.model");

dotenv.config({ path: "../config.env" });

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
const DB = process.env.LOCAL_DB;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        // console.log(con.connections);
        console.log("Connection successful");
    });

// read json file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const comments = JSON.parse(
    fs.readFileSync(`${__dirname}/comments.json`, "utf-8")
);

const replies = JSON.parse(
    fs.readFileSync(`${__dirname}/replies.json`, "utf-8")
);

const profiles = JSON.parse(
    fs.readFileSync(`${__dirname}/profiles.json`, "utf-8")
);

// import data into the database
const importData = async () => {
    try {
        // create collection named tours and insert data to it

        await User.create(users, { validateBeforeSave: false });
        await Comment.create(comments, { validateBeforeSave: false });
        await Reply.create(replies, { validateBeforeSave: false });
        await Profile.create(profiles, { validateBeforeSave: false });

        console.log("Data loaded");
    } catch (error) {
        console.error(error);
    }
    process.exit();
};

// delete data from collections
const deleteData = async () => {
    try {
        await Comment.deleteMany();
        await User.deleteMany();
        await Reply.deleteMany();
        await Profile.deleteMany();

        console.log("Data deleted");
    } catch (error) {
        console.error(error);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
} else {
    console.log("arg 3 required but none given");
}
