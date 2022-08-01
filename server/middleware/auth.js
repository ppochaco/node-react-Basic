const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리
    // 1. 클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    // 2. 토큰을 복호화 한후 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw error;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })

    //유저 있으면 인증 완료
}

module.exports = { auth };