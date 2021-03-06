const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models/index');
const flash = require('express-flash');
const passport = require('passport');
const engine = require('ejs-mate');
var passportConfig = require('./config/passport');


const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const medication = require('./routes/medication');
const usersRouter = require('./routes/users');
const scansRouter = require('./routes/scans');
const PatientsRouter = require('./routes/Patients_List');
const historyRouter = require('./routes/patientHistory');
const appointment = require('./routes/appointment');
const appoint_DOC = require('./routes/appoint_doctor');
const list_DOC = require('./routes/admin_LOD');
const adminpdoctor = require('./routes/Adminp_doctor');
const depart = require('./routes/admin_depart');
const AdminRouter = require('./routes/admin');
const AddHist = require('./routes/addHistory');


const app = express();

const PatientProfile = require('./routes/Patient_Profile');
const patientViewingRouter = require('./routes/patientPage');
const DoctorProfile = require('./routes/Doctor_Profile');


//Load Environment Variables From .env File

require('dotenv').config();

//Database Connection Test
db.sequelize
    .authenticate()
    .then(() => console.log('DB Connection Successful'))
    .catch(err => console.log('Error: ' + err));

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('keyboard'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'node_modules/admin-lte/dist')));
app.use('/plugins', express.static(path.join(__dirname, 'node_modules/admin-lte/plugins')));


//Express Session
app.use(session({
  secret: "keyboard",
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: false
}));
console.log(process.env.SENDGRID_API_KEY);
// Auth Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

//Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});


// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });
// app.use(flash());
// //
// app.use(function (req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

app.use('/doctor', DoctorProfile);
app.use('/patient', PatientProfile);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/patient', scansRouter);
app.use('/patient', historyRouter);
app.use('/patient', patientViewingRouter);
app.use('/medication', medication);
app.use('/appointment', appointment);
app.use('/doctor', appoint_DOC);
app.use('/admin', list_DOC);
app.use('/admin', adminpdoctor);
app.use('/admin', AdminRouter);
app.use('/department', depart);
app.use('/doctor', PatientsRouter);
app.use('/doctor', AddHist);

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

module.exports = app;
require('./routes');
