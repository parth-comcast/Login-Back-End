var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')

var app = express();

var User = require('./models/User.js')
var Post = require('./models/Post')
var auth = require('./auth.js')

mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())

app.get('/post/:id', async (req,res) => {
    var author = req.params.id
    var post = await Post.find({author})
    res.send(post)
})

app.post('/post', auth.checkAuthenticated, (req,res) => {
    var postData = req.body
    postData.author = req.userId
    
    var post = new Post(postData)

    post.save((err, result) => {
        if(err) {
            console.log("saving post err!!");
            return res.status(500).send({message: 'saving post error'});

        } else {
            res.sendStatus(200);
        }
    })
})

app.get('/users', async (req,res) => {
    try {
        var users = await User.find({}, '-password -__v')
        res.send(users)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req,res) => {
    try {
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user)
    } catch(err) {
        res.sendStatus(200)
    }
})

mongoose.connect('mongodb://test:test123@ds229701.mlab.com:29701/pssocial', { useNewUrlParser: true }, (err) => {
    if(!err) {
        console.log("connected to mongo");
    }
})

app.use('/auth', auth.router)
app.listen(process.env.PORT || 3000)