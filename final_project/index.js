const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();
const axios = require("axios");


app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

//Get all book using async callback function
app.get("/axios_book_list", async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000');
      res.status(200).json({ data: response.data });
    } catch (error) {
        res.status(500).json({ data: error });
    }
});

//Search by ISBN – Using Promises
app.get("/axios_search_by_isbn/:isbn", function (req, res) {
    axios.get("http://localhost:5000/isbn/"+req.params.isbn)
    .then(function (response) {
        res.status(200).json({ data: response.data });
    })
    .catch(function (error) {
        res.status(500).json({ data: error });
    });
});

//Search by Author
app.get("/axios_search_by_author/:author", function (req, res) {
    axios.get("http://localhost:5000/author/"+req.params.author)
    .then(function (response) {
        res.status(200).json({ data: response.data });
    })
    .catch(function (error) {
        res.status(500).json({ data: error });
    });
});

//Search by title
app.get("/axios_search_by_title/:title", function (req, res) {
    axios.get("http://localhost:5000/title/"+req.params.title)
    .then(function (response) {
        res.status(200).json({ data: response.data });
    })
    .catch(function (error) {
        res.status(500).json({ data: error });
    });
});

app.listen(PORT,()=>console.log("Server is running"));
