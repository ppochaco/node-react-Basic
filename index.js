const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User');

const config = require('./config/key');

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))