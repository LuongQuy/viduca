const OpenVidu = require('openvidu-node-client').OpenVidu;
const OV = new OpenVidu('localhost:4443', 'MY_SECRET');
var mapSessions = {};
var mapSessionNamesTokens = {};

exports.getClassroom = (req, res, next) => {
    const room = req.query.courseID;
    
    if(mapSessions[room]){
        var mySession = mapSessions[room];
        mySession.generateToken()
        .then(token => {
            mapSessionNamesTokens[room].push(token);
            if(req.user.role === 'TEACHER'){
                res.render('teacher/classroom', {
                    token: token
                });
            }else if(req.user.role === 'LEARNER'){
                res.render('learner/classroom', {
                    token: token
                });
            }
        })
        .catch(err => console.log(err));
    }else{
        OV.createSession()
        .then(session => {
            mapSessions[room] = session;
            mapSessionNamesTokens[room] = [];
            session.generateToken()
            .then(token => {
                mapSessionNamesTokens[room].push(token);
                if(req.user.role === 'TEACHER'){
                    res.render('teacher/classroom', {
                        token: token
                    });
                }else if(req.user.role === 'LEARNER'){
                    res.render('learner/classroom', {
                        token: token
                    });
                }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
}
