var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const sequelize = require('./db')
const User = require('./models/User')

const Group = require('./models/Group');

var indexRouter = require('./routes/index');
var groupRouter = require('./routes/groups');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'studentStudy',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', indexRouter);
app.use('/group', groupRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function setup() {
  const test = await User.create({ username: "test", password: "1234", firstname: "Test", lastname: "Case", school: "Washington State University", email: "test@wsu.edu", bio: "No bio yet"});
  const Logan = await User.create({ username: "Lrfoster03", password: "1234", firstname: "Logan", lastname: "Foster", school: "Washington State University", email: "Logan.Foster@wsu.edu", bio: "No bio yet"});
  // const Elias = await User.create({ username: "Elias", password: "1234" });
  // const Rafael = await User.create({ username: "Rafael", password: "1234" });
  // const subu = await User.create({ username: "subu", password: "1234" });
  const webdev = await Group.create(
    {
      name: "Student Study",
      subject: "Web Development",
      expdate: "2023-04-27",
      groupbio: "A study group for web development students at WSU",
      groupid: 0,
    }
  )
}

// Set up body-parser middleware
//app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for handling form submissions
app.post('/register-group', (req, res) => {
  const groupName = req.body.groupName;
  const subject = req.body.subject;

  // Redirect to student view with the given group name and subject
  res.redirect(`/student-view?groupName=${groupName}&subject=${subject}`);
});

// Define a route for rendering the student view template
app.get('/group-register', (req, res) => {
  const groupName = req.query.groupName;
  const subject = req.query.subject;

  // Render the student view template with the given group name and subject
  res.render('student-view', { groupName, subject });
});

// Start the server

//set static folder

sequelize.sync({ force: true }).then(() => {
  console.log("Sequelize Sync Completed...");
  setup().then(() => console.log("User setup complete"))
})

module.exports = app;
