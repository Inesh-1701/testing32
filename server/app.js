const express = require('express')
const app = express()
const pizzas = require("./pizzas.json")
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.json());

app.get('/pizza/list', function(req, resp){
  console.log('getting all pizzas')
  resp.send(pizzas)
})

module.exports = app;