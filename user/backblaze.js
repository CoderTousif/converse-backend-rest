const got = require("got");

// const id_and_key = "applicationKeyId_value:applicationKey_value";
const id_and_key = `${process.env.b2keyID}:${process.env.b2applicationKey}`;
const token = Buffer.from(id_and_key).toString("base64");

const getBucket = async () => {
    try {
        const response = await got.get(
            "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
            {
                headers: { Authorization: "Basic " + token },
            }
        );

        const parsedData = JSON.parse(response.body);
        console.log(parsedData);
        return parsedData.downloadUrl;
    } catch (error) {
        console.error(error);
    }
};

module.exports = getBucket;
