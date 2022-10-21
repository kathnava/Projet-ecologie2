// Imports
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../Utils/jwtUtils');


// Constants
//const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  CreatePublication: (req, res) => {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    console.log('-------HEADER--------', req.User)
    //decrypt token and get user id
    var userId = jwtUtils.getUserId(headerAuth);

    console.log('---------------', userId)
  
    var texte = req.body.texte;
    var attachement = req.body.attachement;

    console.log('-------attachement', req.body)

    asyncLib.waterfall([
      (done) => {
        models.Post.create({
          texte: texte,
          attachement: attachement,
          userId: userId,
          likesCount: 0,
        })
          .then((newPublication) => {
            done(newPublication);
          });
      }
    ], (newPublication) => {
      if (newPublication) {
        return res.status(200).json({ success: 'Publication successfuly posted', newPublication });
      } else {
        return res.status(500).json({ error: 'cannot post publication ' });
      }
    });
  },


  deletePost: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;

    models.User.findOne({
      where: { id: userId },
    })
      .then(function (userFound) {
        if (userFound) {
          models.Post
            .findOne({
              attributes: ["id", "userId", "texte", "attachement","likesCount"],
              where: { id: postId },
            })
            .then(function (postFound) {
              console.log("ici postFound", postFound);
              if (userFound.id == postFound.dataValues.userId) {
                models.Post.destroy({
                  where: { id: postId },
                });
                return res
                  .status(200)
                  .json({ success: "Your post has been deleted" });
              } else {
                return res.status(403).json({
                  error: "you don't have the rights to delete this post",
                });
              }
            })
            .catch(function (error) {
              return res.status(404).json({ error: "post not found" });
            });
        } else {
          return res.status(403).json({ error: "invalid user" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  PutPost: (req, res) => {
    var headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;

    let texte = req.body.texte;
    let attachement = req.body.attachement;


    asyncLib.waterfall([
      (done) => {
        models.Post.findOne({
          attributes: ['id','userId', 'texte','attachement','likesCount'],
          where: { id: postId }
        })
          .then((postFound) => {
            done(null, postFound);
          })
          .catch((err) => {
            return res.status(400).json({ error: 'Unable to verify publication' });
          });
      },
      (postFound, done) => {
        if (postFound) {
          postFound.update({
            texte: (texte ? texte : postFound.texte),
            attachement: (attachement ? attachement : postFound.attachement),

          })
            .then((postFound) => {
              done(postFound);
            })
            .catch((err) => {
              res.status(500).json({ error: 'cannot update publication' });
            });
        }
        else {
          res.status(404).json({ error: 'An error occurred' });
        }
      },
    ],
      (postFound) => {
        if (postFound) {
          res.status(200).json({ success: 'Publication successfuly modified' })
        }
        else {
          return res.status(500).json({ error: 'cannot update publication profile' });
        }
      })
  },

  getPost: (req, res) => {
    var userId = req.params.id;

    models.Post.findOne({
      attributes: ['id', 'texte'],
      where: { id: userId }
    })
      .then((user) => {
        if (user) {
          res.status(201).json(user)
        }
        else {
          res.status(404).json({ 'error': 'Publication not found' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ 'error': 'Cannot fetch Publication' });
      })
  },

  getPostOne: (req, res) => {
    var postId = req.params.id;

    models.Post.findOne({
      attributes: ['id', 'texte','attachement','likesCount','createdAt' ],
      where: { id: postId }
    })
      .then((post) => {
        if (post) {
          res.status(201).json(post)
        }
        else {
          res.status(404).json({ 'error': 'Publication not found' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ 'error': 'Cannot fetch Publication' });
      })
  },
  
  // getAllPosts: (req, res) => {
  //   models.Post.findAll({
  //     attributes: ['id', 'userId', 'texte', 'attachement','likesCount']
  //   })
  //     .then((posts) => {
  //       res.status(200).json({ success: posts })
  //       //res.render('home', {data : posts})
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json({ error: 'An error occurred' });
  //     });
  // },
  

  getAllPosts: (req, res) => {
        models.User.findAll({
            include : [ 
                {   model : models.Post },                
                {   model : models.Like   },
                
              ]
        })
        .then((posts) => {
            // refaire une requette
            res.status(200).json({success:posts})
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: 'An error occurred' });
        });
    },
    
  getmyPost: (req, res) => {

    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);


    models.Post.findAll({

      attributes: ['id', 'userId', 'texte', 'attachement','likesCount'],

      where: { userId: userId }

    }).then((Post) => {

      res.status(200).json({ success: Post })

      //res.render('home', {data : posts})

    })

      .catch((err) => {

        console.log(err);

        res.status(400).json({ error: 'An error occurred' });

      });

  },
}
