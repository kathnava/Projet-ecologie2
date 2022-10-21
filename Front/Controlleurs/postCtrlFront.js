const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');
//var jwtUtils = require('../../ProjetBack/jwtUtils');



exports.addPost = async (req, res) => {
  
  fetch("http://localhost:8080/api/new", {

    // Adding method type
    method: "POST",
    headers: {
      Authorization: localStorage.getItem('token'),// Token à récupérer 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // Adding body or contents to sen
    body: JSON.stringify({
      texte: req.body.texte,
      attachement: req.body.attachement,
      likesCount: req.body.likescount,
    }),
  })

    // Converting to JSON
    .then(response => response.json())
    // Displaying results to console
    .then(json => {

      // res.render('home',json)
      res.redirect('/')
    })
}


exports.getPostAll = async (req, res, next) => {
  const posts = await fetch('http://localhost:8080/api/getAllPosts')

  const userPost = await posts.json()

  console.log('---------ici on post ------', userPost);

  const response = await fetch(`http://localhost:8080/api/me/${req.params.id}`, {
    headers: {
      Authorization: localStorage.getItem('token')// Token à récupérer
    }
  });

  const moi = await response.json();

  if (userPost) {
    res.render('home', { post: userPost, me: moi })
  }

}


exports.getUserByToken = async (req, res, next) => {

  console.log('jy suis ');

}


exports.getmyPostFront = async (req, res) => {
  const myPost = await fetch('http://localhost:8080/api/getmyPost', {
    headers: {
      Authorization: localStorage.getItem('token'),// Token à récupérer
    },
  })
  userPost = await myPost.json()
  if (userPost.success) {
    res.render('profil', { me: moi, post: userPost })
  }
}

exports.getmyPostFrontPourDelete = async (req, res) => {

  const myPost = await fetch('http://localhost:8080/api/getmyPost', {
    headers: {
      Authorization: localStorage.getItem('token'),// Token à récupérer
    },
  })
  userPost = await myPost.json()

  if (userPost.success) {
    res.render('DeletePost', { me: moi, post: userPost })
  }

}

exports.deletePostFront = async (req, res) => {

  let postId = req.params.id;

  const response = await fetch(`http://localhost:8080/api/del/${req.params.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"), // Token à récupérer

      },
    }
  );
  const myJson = await response.json();
  console.log('MYSON', myJson)
  res.redirect("/profil/DeletePost");
}

exports.UpdatePostFront = async (req, res) => {


  const response = await fetch(`http://localhost:8080/api/put/${req.params.id}`,
    {
      method: "PUT",

      body: JSON.stringify({
        texte: req.body.texte,
        attachement: req.body.attachement,
      }),

      headers: {

        "Content-type": "application/json",

        Authorization: localStorage.getItem("token"), // Token à récupérer

      },
    }
  );

  const myJson = await response.json();
  console.log("update-----demande", myJson)

  res.redirect("/profil");

};


exports.showPageNewPost = async (req, res, next) => {
  res.render('Poster')
}

exports.showPageDeletePost = async (req, res, next) => {

  res.render('DeletePost')
}

exports.getPostOneFront = async (req, res, next) => {

  const posts = await fetch(`http://localhost:8080/api/getPostOne/${req.params.id}`, {

    headers: {
      Authorization: localStorage.getItem('token')// Token à récupérer
    }
  });

  const myJson = await posts.json();


  res.render('ZoomPost', { success: myJson })

  return next();


}

