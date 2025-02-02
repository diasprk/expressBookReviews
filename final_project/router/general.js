const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let keys = Object.keys(books)
  let searched_books = []
  for(let key in keys){
    let book11 = books[key]
    if (book11 != null && book11.author != null && book11.author == author) {
      // console.log(book11)
      searched_books.push(book11)
    }
  }
  res.send(searched_books)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  console.log(title)
  let keys = Object.values(books)
  console.log(keys)
  let searched_books = []
  for(let key in keys){
    console.log(key)
    let book11 = books[key]
    if (book11 != null && book11.title != null && book11.title === title) {
      console.log(book11)
      searched_books.push(book11)
    }
  }
  res.send(searched_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
