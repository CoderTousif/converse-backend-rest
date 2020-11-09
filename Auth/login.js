const kratosAdminURL = process.env.KRATOS_ADMIN_URL;
// express.get('/auth/login', loginRoute)

export const loginRoute = (req, res) => {
    const request = req.query['request'];
    const url = new URL(`${kratosAdminURL}/auth/browser/requests/login`);
    url.searchParams.set('request', request);

    fetch(url.toString())
        .then((r) => r.json())
        .then((kratos) => res.render('loginView', { kratos }));
};
