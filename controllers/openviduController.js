const OpenVidu = require('openvidu-node-client').OpenVidu;
// const OV = new OpenVidu('https://45.32.99.33:4443', 'MY_SECRET');
const OV = new OpenVidu('localhost:4443', 'MY_SECRET');
var mapSessions = {};
var mapSessionNamesTokens = {};

exports.getClassroom = (req, res, next) => {
    const room = req.query.courseID;
    
    if(req.user.role == 'LEARNER'){
        if(mapSessions[room]){
            var mySession = mapSessions[room];
            mySession.generateToken()
            .then(token => {
                mapSessionNamesTokens[room].push(token);
                var username = '';
                if(typeof req.user.info.lastname != 'undefined'){username += req.user.info.lastname;}
                if(typeof req.user.info.firstname != 'undefined'){username += ' ' + req.user.info.firstname;}
                res.render('learner/classroom', {
                    token: token,
                    username: username,
                    email: req.user.local.email
                });
            })
            .catch(err => console.log(err));
        }else{
            res.send('Giáo viên chưa vào lớp, bạn vui lòng đợi!');
        }
        
    }else if(req.user.role == 'TEACHER'){
        OV.createSession()
        .then(session => {
            mapSessions[room] = session;
            mapSessionNamesTokens[room] = [];
            session.generateToken()
            .then(token => {
                mapSessionNamesTokens[room].push(token);
                var username = '';
                if(typeof req.user.info.lastname != 'undefined'){username += req.user.info.lastname;}
                if(typeof req.user.info.firstname != 'undefined'){username += ' ' + req.user.info.firstname;}
                if(req.user.role === 'TEACHER'){
                    res.render('teacher/classroom', {
                        token: token,
                        username: username,
                        email: req.user.local.email
                    });
                }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }else{
        res.send('Bạn không có quyền tham gia lớp học này, vui lòng quay trở lại!');
    }
}