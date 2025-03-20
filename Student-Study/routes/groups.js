var express = require('express');
const Group = require('../models/Group')
var router = express.Router();

var groupid = 1;

const sessionChecker = (req, res, next)=>{
  if(req.session.user){
    res.locals.loggedIn = true
    res.locals.username = req.session.user.username
    next()
  }else{
    res.redirect("/login")
  }
}

router.use(sessionChecker)

router.get('/join', async function(req, res, next) {

    //console.log(req.session.user)
  const groups = await Group.findAll();


  res.render('findGroup.ejs', { groups });
    
  });

router.get('/register', function(req,res, next){
    res.render('groupregister.ejs',{title: 'Express'});
  });

  router.post('/register', async function(req, res, next) {
    try {
      await Group.create(
        { 
          name: req.body.groupname, 
          subject: req.body.subject, 
          expdate: req.body.expirationdate, 
          groupbio: req.body.description,
          groupid: groupid,
        }
    )
  
    // const user = await User.findUser(req.body.username, req.body.password)
    // if(user !== null){
    //   req.session.user = user
    //   console.log("user")
    //   res.redirect("/")
    // }else {
    //   res.redirect("/login/?msg=fail")
    // }

    groupid = groupid + 1;
  
    res.redirect('/group/join')
    } catch (error) {
      console.log(error)
      res.redirect('/group/join') 
    }
  });

  // router.post("/join/:groupid", async function (req, res, next) {
    
  //   var group = await Group.findGroup(req.params.groupid)
  //   if (group) {
  //     group = Group.addUserToGroup(req.params.groupid,  req.session.user)
  //     res.redirect('/group/view/' + req.params.groupid)
      
  //   } else {
      
  //   }
    
  // });

  // router.post('/view/:groupid', async function(req,res, next){
  //   var group = await Group.findGroup(req.params.groupid)
  //   if (group) {
  //     group = Group.addUserToGroup(req.params.groupid,  req.session.user)
  //     res.redirect('/group/view/' + req.params.groupid)
  //   } else {
      
  //   }
  // });

  router.get('/view/:groupid', async function(req,res, next){
    var ourgroup = await Group.findGroup(req.params.groupid)
    res.locals.ourgroup = ourgroup
    if (ourgroup) {
      res.render('view.ejs', { ourgroup });
      
    } else {
      
    }
  });
  

module.exports = router;