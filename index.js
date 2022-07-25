const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require('./models/User');

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {   
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('수정'))


app.post('/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
      if(err) return res.json({ success: false, err})
      return res.status(200).json({
        success: true
      })
    })
})

app.post('/login', (req, res) => {

  //1. 요청된 Email을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다룽~"
      })
    }
    
    //2. 요청된 Email이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //3. 비밀번호 일치하면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장 (로컬스토리지도 가능)
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
      })
  
    })

  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))