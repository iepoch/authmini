const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const session = require('express-session');

const db = require('./database/dbHelper.js');
const server = express();

server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}))
server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  if (req.session && req.session.userId)
  {
    db.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(500).send(err));
  }
  else {
    res.status(400).send('acess denied')
  }

});

server.post('/api/register', (req, res) => {
  const user = req.body

  user.password = bcrypt.hashSync(user.password, 10)

  db
    .insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0]})
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.post('/api/login', (req, res) => {
//Check if username exists and the passwords match the user
  const creds = req.body

  db.findByUser(creds.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(creds.password, users[0].password)) {
        //Put on the session that will go on the cookie as well
        req.session.userId = users[0].id;

        res.status(200).json({info: "correct"})
      }
      else {
        res.status(404).json({err: "Invalid Username or Password"})
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })



})


server.listen(3300, () => console.log('\nrunning on port 3300\n'));
