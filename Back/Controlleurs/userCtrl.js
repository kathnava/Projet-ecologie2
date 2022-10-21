const bcrypt = require('bcrypt');
const jwtUtils = require('../Utils/jwtUtils');
const models = require('../models');
const asyncLib = require('async');
const cookieParser = require('cookie-parser');
require('dotenv').config();
//const { nextTick } = require('process');

// constants
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
// const PASSWORD_REGEX = /^.{4,8}$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
//mot de passe 8 caracteres - une maj un chiffre un cara special

//Routes
module.exports = {
  addUser: (req, res) => {
   
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;
    let password = req.body.password;
    let isAdmin = req.body.isAdmin;

    if (email == "" || nom == "" || prenom == "" || password == "") {
      //res.render('register', {errorMessage: 'Parametres manquantes'})
      return res.status(400).json({ 'error': 'Parametres manquantes' })
    }

    if (!EMAIL_REGEX.test(email)) {
      //res.render('register', {errorMessage: 'Email not valid'})
      return res.status(400).json({ 'error': 'Email not valid' })
    }

    if (!PASSWORD_REGEX.test(password)) {
      //res.render('register', {errorMessage: 'Password not valid'})
      return res.status(400).json({ 'error': 'Password not valid' })
    }
    //Verifier si le user exist sinon créer un user
    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
          .then((userFound) => {
            done(null, userFound)
          })
          .catch((err) => {
            console.log(err)
            return res.status(409).json({ 'error': 'An error occurred' })
          })
      },
      (userFound, done) => {
        if (!userFound) {
          bcrypt.hash(password, 5, (err, bcryptedPassword) => {
            done(null, userFound, bcryptedPassword)
          })
        }
        else {
          //res.render('register', {errorMessage: 'User Already exists'})
          return res.status(409).json({ 'error': 'User Already exists' })
        }
      },
      (userFound, bcryptedPassword, done) => {

        let newUser = models.User.create({
          nom: nom,
          prenom: prenom,
          email: email,
          password: bcryptedPassword,
          isAdmin: 0
        })
          .then((newUser) => {
            done(newUser)
          })
          .catch((err) => {
            console.log(err)
            //res.render('register', {errorhMessage: 'An error occurred'})
            res.status(400).json({ 'error': 'An error occurred' })
            return;
          })
      }
    ], (newUser) => {
      if (newUser) {
        // res.render('register', {successMessage: 'user successfuly created'}, res.redirect('/login'))

        return res.status(201).json({ 'success': 'user successfuly created' })
      }
      else {
        //res.render('register', {errorMessage: 'An error occurred'})
        return res.status(400).json({ 'error': 'An error occurred' })
      }
    })
  },
  
  
  getUser: (req, res) => {
    var userId = req.params.id;

    models.User.findOne({
      attributes: ['id', 'nom', 'prenom', 'email', 'isAdmin'],
      where: { id: userId }
    })
      .then((user) => {
        if (user) {
          res.status(201).json(user)
        }
        else {
          res.status(404).json({ 'error': 'User not found' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ 'error': 'Cannot fetch user' });
      })
  },

  getAllUsers: (req, res) => {
    models.User.findAll({
      attributes: ['id', 'nom', 'prenom', 'email', 'isAdmin']
    })
      .then((users) => {
        res.status(200).json(users)
      })
      .catch((err) => {
        res.status(400).json({ 'error': 'An error occurred' });
      });
  },

  login: (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email == "" || password == "") {
      return res.status(400).json({ error: "one or more fields are empty" });
    }
    models.User.findOne({
      where: { email: email }
    })
      .then(function (userFound) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function (errorBcrypt, resBcrypt) {
            if (resBcrypt) {
              const token = jwtUtils.generateTokenForUser(userFound)
              console.log(token);
              res.cookie('jwt', token)
              return res.status(200).json({ success: "successfully logged in", userId: userFound.id, nom: userFound.nom, token: token });

            } else {
              return res.status(403).json({ error: "invalid password" });
            }
          })
        } else {
          return res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      })
  },

  getUserMe: (req, res, next) => {
 
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth)

    if (userId < 0) {
      return res.status(400).json({ 'error': 'An error occured mauvais token' })
    }
    models.User.findOne({

      attributes: ['id', 'nom', 'prenom', 'email', 'isAdmin'],
      where: { id: userId }
    })
      .then((user) => {
        if (user) {
          //req.user = user;
          res.status(201).json(user);
          return next();
        }
        else {
          res.status(404).json({ 'error': 'user not found' });
          return next();
        }
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({ 'error': 'cannot fetch user' });
      });
  },

  PutUser: (req, res) => {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let email = req.body.email;
    let isAdmin = req.body.isAdmin;

    asyncLib.waterfall([
      (done) => {
        models.User.findOne({
          attributes: ['id', 'nom', 'prenom', 'email', 'isAdmin'],
          where: { id: userId }
        })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((err) => {
            return res.status(400).json({ 'error': 'Unable to verify user' });
          });
      },
      (userFound, done) => {
        if (userFound) {
          userFound.update({
            nom: (nom ? nom : userFound.nom),
            prenom: (prenom ? prenom : userFound.prenom),
            isAdmin: (isAdmin ? isAdmin : userFound.isAdmin)
          })
            .then((userFound) => {
              done(userFound);
            })
            .catch((err) => {
              res.status(500).json({ 'error': 'cannot update user' });
            });
        }
        else {
          res.status(404).json({ 'error': 'An error occurred' });
        }
      },
    ],
      (userFound) => {
        if (userFound) {
          res.status(200).json({ 'success': 'User successfuly modified' })
        }
        else {
          return res.status(500).json({ 'error': 'cannot update user profile' });
        }
      });
  },
}
