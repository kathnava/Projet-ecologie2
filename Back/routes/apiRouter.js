//import
const express = require('express');
const userCtrl = require('../Controlleurs/userCtrl');
const postCtrl = require('../Controlleurs/postCtrl');
const likeCtrl = require('../Controlleurs/likeCtrl')
const cookieParser = require('cookie-parser');
const AdminCtrl = require('../Controlleurs/AdminCtrl');

// Router
exports.router = (()=>{
    const apiRouter = express.Router();

//route user
apiRouter.route('/register').post(userCtrl.addUser);
apiRouter.route('/login').post(userCtrl.login);
apiRouter.route('/me/:id').get(userCtrl.getUserMe);
apiRouter.route('/getUser/:id').get(userCtrl.getUser);
apiRouter.route('/getAll').get(userCtrl.getAllUsers);
apiRouter.route('/put').put(userCtrl.PutUser);

// Route Admin Supprime User
apiRouter.route('/deleteUserByAdmin/:id').delete(AdminCtrl.deleteUserByAdmin);

// Route Admin supprime Post
apiRouter.route('/deletePostByAdmin/:id').delete(AdminCtrl.deletePostByAdmin);


//route post 
apiRouter.route('/new').post(postCtrl.CreatePublication);
apiRouter.route('/getAllPosts').get(postCtrl.getAllPosts);
apiRouter.route('/getmyPost').get(postCtrl.getmyPost);
apiRouter.route('/del/:id').delete(postCtrl.deletePost);
apiRouter.route('/put/:id').put(postCtrl.PutPost);
apiRouter.route('/getPostOne/:id').get(postCtrl.getPostOne);

//route like
apiRouter.route('/like/:id').post(likeCtrl.like);

apiRouter.route('/unlike/:id').post(likeCtrl.unlike);

return apiRouter;
})();