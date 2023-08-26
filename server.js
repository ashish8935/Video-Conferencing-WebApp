require('dotenv').config();
const express = require('express');
var session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const passport = require('passport');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport');
const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');
const bodyParser = require('body-parser');

const connectionString = process.env.MONGO_URI;


require('./config/passport')(passport);

// Connect using promises
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Additional logic after successful connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/index', indexRoute);
app.use('/auth', userRoute);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/newMeeting', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});


app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log('User', userId, 'is joining room', roomId);

    socket.join(roomId);
    socket.on('ready',()=>{
        socket.broadcast.to(roomId).emit('user-connected',userId);
        });

    socket.on('disconnect', () => {
      console.log('User', userId, 'disconnected from room', roomId);
      socket.to(roomId).emit('user-disconnected', userId);
    });

    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })
  });
});

io.on("connect_error", (err) => {
  console.log(`Connection error: ${err.message}`);
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// mailing work
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sarrafashish321@gmail.com',
    pass: process.env.PASSKEY
  }
});

app.post('/invite', async(req, res) => {
var mailOptions = {
  from: 'sarrafashish321@gmail.com',
  to: req.body.xyz,
  subject: 'Sending Email using Node.js',
  text: 'https://localhost:3000/abc/zxy-ght',
  body: 'Join khokhaMeets using this url'
};

transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
  } else{
    console.log('Email sent: ' +info.response);
  }
});

res.redirect('/room');

})