// Import the ORY Kratos SDK. SDKs are available for all popular programming
// languages! We will add examples for other programming languages here soon.
const kratos = require('@oryd/kratos-client');
// import { AdminApi, PublicApi } from '@oryd/kratos-client';

const publicEndpoint = new kratos.PublicApi('https://public.ory-kratos');
const adminEndpoint = new kratos.AdminApi('https://admin.ory-kratos');

exports.needsLogin = (req, res, next) => {
    new publicEndpoint.whoami(req)
        .then(({ body }) => {
            req.user = { session: body };
            next();
        })
        .catch(() => {
            res.redirect('/login');
        });
};

// You can use `needsLogin` as a middleware for Express or any other web framework:
//   import express from 'express'
//   const app = express()
//
//   app.get("/dashboard", needsLogin, dashboard)
//
