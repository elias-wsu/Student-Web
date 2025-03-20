var express = require('express');
const User = require('../models/User')
var router = express.Router();


const bodyParser = require('body-parser');
const { where } = require('sequelize');
router.use(bodyParser.urlencoded({ extended: true }));

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.locals.loggedIn = true
    res.locals.username = req.session.user.username
    res.locals.password = req.session.user.password

    next()
  } else {
    res.locals.loggedIn = false
    next()
    // res.redirect("/?msg=raf")
  }
}

router.use(sessionChecker)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login.ejs', { title: 'Express' });
});

// Logs in User for the session
router.post('/login', async function (req, res, next) {
  // console.log(req.body.username + " - " + req.body.password)
  const user = await User.findUser(req.body.username, req.body.password)
  if (user !== null) {
    req.session.user = user
    console.log("user")
    res.redirect("/")
  } else {
    res.redirect("/login/?msg=fail")
  }
});

router.post('/signup', async function (req, res, next) {
  try {
    await User.create(
      {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        school: req.body.school,
        email: req.body.email,
        bio: "No bio yet."
      }
    )

    const user = await User.findUser(req.body.username, req.body.password)
    if (user !== null) {
      req.session.user = user
      console.log("user")
      res.redirect("/")
    } else {
      res.redirect("/login/?msg=fail")
    }


  } catch (error) {
    console.log(error)
    res.redirect('/signup')
  }
});

router.get('/logout', function (req, res, next) {
  if (req.session.user) {
    req.session.destroy()
    res.redirect("/")
  }
  else {
    res.redirect("/")
  }
});

router.get('/signup', function (req, res, next) {
  res.render('register.ejs', { title: 'Express' });
});

router.get('/about', function (req, res, next) {
  res.render('about.ejs', { title: 'Express' });
});







router.get('/profile', async function (req, res, next) {
  try {
    if (res.locals.loggedIn) {
      const user = await User.findUser(req.session.user.username, req.session.user.password)

      if (user !== null) {
        res.render('profile.ejs', { user });
      } else {
        res.redirect("/signup");
      }

    } else {
      res.redirect("/signup")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/profile/?msg=error")
  }

});

router.post('/chg_usrname', async function (req, res, next) {
  try {
    const user = await User.findUser( req.session.user.username,req.session.user.password)
    if (user !== null) {
      const placeholder = await User.usernameExists(req.body.newusername)
      if (placeholder === false) {

        const test = await User.create({ username: req.body.newusername, password: user.password, firstname: user.firstname, lastname: user.lastname, school: user.school, role: user.role, email: user.email, bio:user.bio });
        await user.destroy()

        res.locals.username = req.body.newusername
        req.session.user = test

        res.redirect("/profile")
      } else {
        res.redirect("/profile/?msg=usrname+exists")
      }
    } else {
      res.redirect("/profile/?msg=fail")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/profile/?msg=error")
  }
});


router.post('/chg_pswrd', async function (req, res, next) {
  try {
    const user = await User.findOne({ where: { username: req.session.user.username, password: req.session.user.password } })

    if (user !== null) {
      if (req.body.newpassword === req.body.reppassword)  // passwords match
      {

        req.session.user.password = req.body.newpassword
        res.locals.password = req.body.newpassword
        user.password = req.body.newpassword
        await user.save()
        req.session.user = user

        res.redirect("/profile")
      } else {
        res.redirect("/profile/?msg=psswrds+not+match")
      }
    } else {
      res.redirect("/profile/?msg=fail")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/profile/?msg=error")
  }
});

router.post('/chg_email', async function (req, res, next) {

  try {
    const user = await User.findUser(req.session.user.username, req.session.user.password)
    const placeholder = await User.emailExists(req.session.user.username, req.body.newemail)

    if (!placeholder) { // email does not exist
      if (req.body.newemail.includes("@")) { //valid email addr
        if (user !== null) {
          user.email = req.body.newemail
          await user.save();
          res.redirect("/profile")
        } else {
          res.redirect("/profile/?msg=fail")
        }
      } else { //invalid email addr
        res.redirect("/profile/?msg=invalid+email")
      }

    }
    else {  // email does  exist
      res.redirect("/profile/?msg=email+exists")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/profile/?msg=error")
  }

});

router.post('/chg_bio', async function (req, res, next) {

  const user = await User.findUser(req.session.user.username, req.session.user.password)

  try {
    if (user !== null) {
      user.bio = req.body.newbio
      await user.save();
      res.redirect("/profile")
    } else {
      res.redirect("/profile/?msg=fail")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/profile/?msg=error")
  }


});

module.exports = router;