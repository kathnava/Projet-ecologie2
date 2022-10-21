// IMPORT & VARIABLES//
const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');

// ADMIN VIEWS CONTROLS //

exports.getAllUserFront = async (req, res, next) => {

    const users = await fetch(`http://localhost:8080/api/getAll`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });
         userPost = await users.json()
         if(userPost.success){
            res.render('admin',{ user: userPost  })
        }

    next();
}


exports.showPageAdmin = async (req, res, next) => { 
  
    res.render('admin')
}

exports.getAllUtilisateursFront= async (req, res, next) => {

    const posts = await fetch(`http://localhost:8080/api/getAll`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });
         userPost = await posts.json()
        
         if(userPost){

            console.log(userPost)
    
            res.render('lesutilisateurs', { user : userPost })
    
        }  
    }

exports.showPageLesUsers = async (req, res, next) => { 
  
    res.render('lesutilisateurs')
}

exports.deleteUserFront = async (req, res) => {
    
    let userId = req.params.id;
    console.log('-------userId ', userId);

  const response = await fetch(`http://localhost:8080/api/deleteUserByAdmin/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"), // Token à récupérer

      },
    }
  );
  const myJson = await response.json();
  console.log('MYSON (((--------- ',myJson)
  res.redirect('/lesutilisateurs');
}

exports.getPostAllByAdmin = async (req,res) => {
    const posts = await fetch('http://localhost:8080/api/getAllPosts',{
        headers: {
            Authorization: localStorage.getItem('token'),// Token à récupérer
        },

    })
    const userPost = await posts.json()
    console.log(userPost);
    const response = await fetch(`http://localhost:8080/api/me/${req.params.id}`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });

    const moi = await response.json();


    if(userPost.success){
        res.render('deletePostByAdmin',{me : moi , post: userPost  })
    }
  }
    

    
exports.deletePostByAdmin = async (req, res) => {
    
  let postId = req.params.id;

const response = await fetch(`http://localhost:8080/api/deletePostByAdmin/${postId}`,
  {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: localStorage.getItem("token"), // Token à récupérer

    },
  }
);
const userPost = await response.json();
if (userPost ) {
// console.log('MYSON',myJson)
res.redirect('/deletePostByAdmin' );
}
}


exports.showPageLesposts = async (req, res, next) => { 
  
    res.render('deletePostByAdmin');
}


