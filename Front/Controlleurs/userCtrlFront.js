const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');

exports.addUser = async (req, res) => {
    const data = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        password  : req.body.password,
    };
    fetch('http://localhost:8080/api/register', {
      
        // Adding method type
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // Adding body or contents to send
        body: JSON.stringify(data),
      
    })
    //Converting to JSON
    .then((res) => {  
        return res.json() 
    })
    // Displaying results to console
    .then(json => {
        if(!json.error)
            res.redirect('/login');
        else  
            res.render('register', json)
    })
}

exports.logUser = async (req, res, next) => {
 
    await fetch("http://localhost:8080/api/login", {
        // Adding method type
        method: "POST",
        // Adding headers to the request
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        // Adding body or contents to send
        body: JSON.stringify({
            email : req.body.email,
            password  : req.body.password,
        }),
    })
    // Converting to JSON
    .then((res) => {  
        return res.json() 
    })
    // Displaying results to console
    .then(json => {
        localStorage.setItem('token', json.token);
        if (localStorage.getItem('token')) {
            res.redirect('/profil')
        }
        else {
            res.render('index', json)
        }
    })
    
    .catch((err) => {
        console.error(err);
    })

// res.redirect('/')
}
exports.logOut  = async(req, res, next) => {
    localStorage.clear();
    res.redirect('/login')
}

exports.getUserByToken = async (req, res, next) => {

    const myProfil = await fetch(`http://localhost:8080/api/me/${req.params.id}`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });

     moi = await myProfil.json();

    next();
}

exports.showPageUpdateUser = async (req, res, next) => { 
    res.render('modifierleprofil')
}

exports.updateUser = async (req, res, next) => {

    console.log('on est là')

    fetch(`http://localhost:8080/api/put`, {
      // Adding method type
      method: "PUT",
  
      // Adding body or contents to send
      body: JSON.stringify({
        nom: req.body.nom,
        prenom: req.body.prenom,
      }),

  
      // Adding headers to the request
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"), //Token à récupérer
      },
    })
      // Converting to JSON
      .then((response) => response.json())
  
      // Displaying results to console
      .then((json) => {
        console.log(json);

        res.redirect('/profil/update');
      });
}

exports.getUserByTokenForMenu = async (req, res, next) => {
    // console.log('---toto---', req.params.id)
    // il faut recuperer le id depuis le token
    // const idByToken = 
    const response = await fetch(`http://localhost:8080/api/me/${req.params.id}`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });

    const myJson = await response.json();
    res.render('home', { User: myJson });
    return next();
}
  
  exports.getMe = async (req,res) => {

    const response = await fetch(`http://localhost:8080/api/me/${req.params.id}`, {
        headers: {
            Authorization: localStorage.getItem('token')// Token à récupérer
        }
         });

    const moi = await response.json();


    if(userPost.success){
        res.render('home',{me : moi , post: userPost  })
    }
    
}

