const kratosAdminURL = process.env.KRATOS_ADMIN_URL;
// express.get('/auth/registration', registrationRoute)

export const registrationRoute = (req, res) => {
    const request = req.query['request'];
    const url = new URL(`${kratosAdminURL}/auth/browser/requests/registration`);
    url.searchParams.set('request', request);

    fetch(url.toString())
        .then((r) => r.json())
        .then((kratos) => res.render('registrationView', { kratos }));
};
