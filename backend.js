require('dotenv').config()
const cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var await = require('await');
require('./rdbms');
const port = process.env.PORT || 8000;
var path = require('path')
var indexRouter = require('./indexRouter');
const bodyparser = require('body-parser');
const { copyFileSync } = require('fs');
var hbs = require('hbs');
const Tests = require('./models/registers');
const Details = require('./models/details');
const Company = require('./models/company')
const Bcrypt = require('bcryptjs');
const auth = require('./auth')
var userData = require('./data')


// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cookieParser())

app.use('/viewInternship', indexRouter);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './templates/views'));

app.use(express.static(path.join(__dirname, './templates')))
console.log(path.join(__dirname + '/templates/static_files'))
hbs.registerPartials(path.join(__dirname, './templates/partials'))


app.get('/', function (req, res) {
  res.render("home");
});

app.get('/signup', function (req, res) {
  res.render("signup");
});
app.get('/signin', function (req, res) {
  res.render("signin");
});
app.get('/addInternship', auth, (req, res) => {
  res.render("add_internship", { userData: userData });
});
app.get('/logout', async (req, res) => {
  try {
    res.clearCookie('jwt')
    res.status(201).render("home")
  } catch (error) {
    res.status(401).send(error)
  }
});

//this is database operation for backend
app.post('/interndetail',auth,async (req, res) => {
  try {
    var obj = {
      cname: req.body.cname,
      stipend: req.body.stipend,
      cpi: req.body.cpi,
      duration: req.body.duration
      , date: req.body.date
    }
    var D = new Details({
      cname: obj.cname,
      stipend: obj.stipend,
      cpi: obj.cpi,
      duration: obj.duration,
      date: obj.date
    })

    var Det = await D.save();
    res.send("<h1>you successfully data inserted</h1>")
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post('/register', async (req, res) => {

  try {
    var obj = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    }
    var R = new Tests({
      fname: obj.fname,
      lname: obj.lname,
      email: obj.email,
      password: obj.password
    })
    const token = await R.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true
    })
    const reg = await R.save();
    res.status(201).render("signin");
  } catch (error) {
    res.status(400).send(error);
  }

});
app.post('/check', async (req, res) => {
  try {
    var obj = {
      email: req.body.email,
      password: req.body.password
    }
    var useremail = await Tests.findOne({
      email: obj.email
    })
    if (await Bcrypt.compare(obj.password, useremail.password)) {
      const token = await useremail.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 500000),
        httpOnly: true
      })
      var result = await Details.find({});
      //here we store user information for
      userData.fname = useremail.fname;
      userData.email = useremail.email;
      res.render('user-list', { title: 'company details', details: result, userData: userData });
    }
    else res.send("<h1>your login unsuccessful</h1>")

  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/submit', auth, function (req, res) {
  userData.cname = req.body.demo;
  res.render('resume', { userData: userData })
})
app.post('/final-submit', auth, async (req, res) => {
  try {
    var D = new Company({
      cname: userData.cname,
      fname: userData.fname,
      email: userData.email
    })

    var Det = await D.save();
    res.send("<h1>you successfully data inserted</h1>")
  } catch (error) {
    res.status(400).send(error);
  }
})

app.listen(port, function () {
  console.log(`listening prot number ${port}`);
});
