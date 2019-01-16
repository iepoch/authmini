const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')

const db = require('./database/dbHelper.js');
const server = express();

server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db.find()
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const user = req.body
  user.password = bcrypt.hashSync(user.password, 16)

  db
    .insert(user)
    .then(id => {
      res.status(201).json({ id: id })
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.post('/api/login', (req, res) => {
//Check if username exists and the passwords match the user
  const bodyUser = req.body

  db.findByUser('username', bodyUser.username)
    .then(users => {
      if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
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
