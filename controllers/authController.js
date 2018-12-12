exports.isLogged = (req, res, next) => {
    if(req.user) return next();
    return res.redirect('/');
}
exports.notLogged = (req, res, next) => {
    if(!req.user) return next();
    else{
        if(req.user.role === 'LEARNER') res.redirect('/learner/courses');
        else if(req.user.role === 'TEACHER') res.redirect('/teacher/courses');
    }
}