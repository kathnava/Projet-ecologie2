const express = require('express');
const LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
const route = express.Router();
const userCtrlFront = require('../Controlleurs/userCtrlFront');
const postCtrlFront = require('../Controlleurs/postCtrlFront');
const likeCtrlFront = require('../Controlleurs/likeCtrlFront');
const AdminCtrlFront = require('../Controlleurs/AdminCtrlFront');
const multer = require ('multer');
const path = require('path');
//const appRouter = express.Router();

    
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
           callback(null, 'public/img/');
       },
       filename: function(req, file, callback)  {
           callback(null, file.originalname);
       }
    })

var upload = multer({ storage: storage });

route.post('/new',upload.single('attachement') ,postCtrlFront.addPost);
route.post('/new', postCtrlFront.addPost);
route.get('/',postCtrlFront.getPostAll);

const token = localStorage.getItem('token');

//LOGIN
route.get('/login', (req ,res) => {

   /* if (token) {
        res.redirect('/')
    }
    else {
        res.redirect('/login')
    }*/
    res.render('../views/index')
});

route.post('/login', userCtrlFront.logUser)


//RIGISTER
route.get('/register',(req,res) => {
res.render('../views/register')
});
route.post('/register', userCtrlFront.addUser);


//HOME
route.get('/', userCtrlFront.getUserByToken, postCtrlFront.getPostAll);

//Profil
route.get('/profil', userCtrlFront.getUserByToken, postCtrlFront.getmyPostFront);
route.get('/logout', userCtrlFront.logOut);


// Delete post dans profil 
route.route('/profil/DeletePost/:id').post( postCtrlFront.deletePostFront);
route.route('/profil/DeletePost').get(userCtrlFront.getUserByToken, postCtrlFront.getmyPostFrontPourDelete, postCtrlFront.showPageDeletePost);

// Update Post dans Profil 
route.route('/profil/put/:id').post(userCtrlFront.getUserByToken, postCtrlFront.UpdatePostFront);

// like et dislike 
route.route('/like/post/:id').post(likeCtrlFront.newLike);
route.route('/unlike/post/:id').post(likeCtrlFront.unLike);

// Modifier le profil 
route.post('/profil/update',userCtrlFront.getUserByToken, userCtrlFront.updateUser );
route.get('/profil/update', userCtrlFront.getUserByToken, userCtrlFront.showPageUpdateUser );

// Ajouter un post 
route.post('/profil/newpost', userCtrlFront.getUserByToken, postCtrlFront.addPost );
route.get('/profil/newpost', userCtrlFront.getUserByToken, postCtrlFront.showPageNewPost );

// Afficher la page ADMIN
route.get('/admin', (req,res)=>{
    res.render('../views/admin')
} );

// Admin afficher les users 
route.get('/lesutilisateurs', AdminCtrlFront.getAllUtilisateursFront);

// Admin supprimer les users 
route.post('/lesutilisateurs/:id', AdminCtrlFront.deleteUserFront);
route.get('/lesutilisateurs', AdminCtrlFront.showPageLesUsers);

// Admin afficher tous les posts de tous les users 
route.get('/deletePostByAdmin', userCtrlFront.getUserByToken, AdminCtrlFront.getPostAllByAdmin);

// Admin supprimer les posts des users 
route.post('/deletePostByAdmin/:id', userCtrlFront.getUserByToken, AdminCtrlFront.deletePostByAdmin );
route.get('/deletePostByAdmin', AdminCtrlFront.showPageLesposts);


// Zoomer un Post 
route.get('/ZoomPost/:id', userCtrlFront.getUserByToken, postCtrlFront.getPostOneFront );

/*route.get('/', (req, res) => {
    res.render('home');
  })*/


/*route.get('/profil', (req,res) => {
    res.render('/../viewS/profil')});*/


module.exports = route;


