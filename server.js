var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var app = express();

var User = require('./models/User.js')

mongoose.Promise = Promise

var posts = [
    {message: 'hello'},
    {message: 'hi'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/posts', (req,res) => {
    res.send(posts)
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

app.post('/register', (req,res) => {
    var userData = req.body;

    var user = new User(userData);
    user.save((err, result) => {
        if(err) {
            console.log("saving user err!!");
        } else {
            res.sendStatus(200);
        }
    })
})

app.post('/login', async (req,res) => {
    var loginData = req.body;

    var user = await User.findOne({email: loginData.email})

    if(!user)
        return res.status(401).send({message: 'email or password not found in DB!!!'});

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if(!isMatch) return res.status(401).send({message: 'password not matched!!!'});

        var payload = {}

        var token = jwt.encode(payload, '123')
    
        res.status(200).send({token});
    })        
})

mongoose.connect('mongodb://test:test123@ds229701.mlab.com:29701/pssocial', { useNewUrlParser: true }, (err) => {
    if(!err) {
        console.log("connected to mongo");
    }
})

app.listen(3000)