const mongoose = require('mongoose');
      User  = mongoose.model('User');
      Spazi  = mongoose.model('Spazi');
      Subject = mongoose.model('Subject');
      subjectCtrl = require('../controllers/subject');

const sendEmail = require('../util/email');

//GET
exports.findAllUsers = async function (req, res){
  const users = await User.find().catch(err => console.error(err.message));
  
  res.status(200).jsonp(users);
};


//GET information current user
exports.findCurrentUser = async function (req, res){
  try {
    const user = await User.findById(req.id);

    if (!user) throw "User token invalid. It is not a user";

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      subject: user.subject
    });

  } catch(error) {
    return res.status(403).send(error);
  }
    // console.log('GET/users/me');
};


//POST contact a spazi
exports.contactSpazi = async function (req, res){
  try {
    const user = await User.findById(req.id);

    if (!user) throw "User token invalid. It is not a user";

    const spazi = await Spazi.findById(req.body.spaziId);

    if (!spazi) throw "Spazi not available";

    const userName = user.name;
    const userEmail = user.email;
    const spaziName = spazi.name;
    const spaziEmail = spazi.email;
    const message = req.body.message;
    const dateStart = req.body.dateStart;
    const dateEnd = req.body.dateEnd;

    const dataEmail = {
      userEmail: userEmail,
      userName: userName,
      spaziName: spaziName,
      spaziEmail: spaziEmail,
      message: message,
      dateStart: dateStart,
      dateEnd: dateEnd
    }

    sendEmail(dataEmail);

  } catch(error) {
    return res.status(403).send(error);
  }

  res.status(200).json({status: 'OK', message: 'Message sent'});
    // console.log('GET/users/me');
};


//GET - ID
exports.findUserByID = async function (req, res){
  const user = await User.findById(req.params.id).catch(err => console.error(err.message));
  console.log('GET/users/:id');
  res.status(200).jsonp(user);
};


//PUT
exports.updateUser = async function(req, res){
  const user = await User.findById(req.params.id).catch(err => console.error(err.message));
  const body = req.body;

  for (let contact in body.contact){
    console.log(contact);
    user.contact[contact] = body.contact[contact];
  }

  for (let item in body){
    if (item != 'contact' && item != 'subject'){
      console.log(item);
      user[item] = body[item];
    }
  }

  console.log('PUT/users/:id');
  user.save(function (err){
    if(err) res.send(500, err.message);
      
    res.status(200).jsonp(user);
  });
};

//POST
exports.createUser = async function(req, res){

    const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
    subject: req.body.subject,
    reviews: req.body.reviews
    
  });

    console.log('POST/users/');
    user.save(function (err){
      if(err) res.status(500).send(err.message);
      
      res.status(200).json({status: 'OK', message: `User ${user.name} created`});
    });
};

//DELETE
exports.deleteUser = async function(req, res){
  const user = await User.findById(req.params.id).catch(err => console.error(err.message));
  user.remove(function(err) {
      if(err) res.send(500, err.message);
    res.status(200).send({});
    });
};
