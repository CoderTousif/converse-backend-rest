// const config = {
//     client: {
//         id: "<client-id>",
//         secret: "<client-secret>",
//     },
//     auth: {
//         tokenHost: "https://api.oauth.com",
//     },
// };

// const {
//     ClientCredentials,
//     ResourceOwnerPassword,
//     AuthorizationCode,
// } = require("simple-oauth2");

// async function run() {
//     const client = new AuthorizationCode(config);

//     const authorizationUri = client.authorizeURL({
//         redirect_uri: "http://localhost:4000/callback",
//         scope: "<scope>",
//         state: "<state>",
//     });

//     // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
//     res.redirect(authorizationUri);

//     const tokenParams = {
//         code: "<code>",
//         redirect_uri: "http://localhost:4000/callback",
//         scope: "<scope>",
//     };

//     try {
//         const accessToken = await client.getToken(tokenParams);
//     } catch (error) {
//         console.log("Access Token Error", error.message);
//     }
// }

// run();
