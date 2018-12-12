exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/');
}