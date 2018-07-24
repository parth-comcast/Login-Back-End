var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express();

var User = require('./models/User.js')
var Post = require('./models/Post')
var auth = require('./auth.js')

mongoose.Promise = Promise

var posts = [
    {message: 'hello'},
    {message: 'hi'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/post', (req,res) => {
    res.send(posts)
})

app.post('/post', (req,res) => {
    
    var post = new Post(req.body)

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

app.use('/auth', auth)
app.listen(3000)