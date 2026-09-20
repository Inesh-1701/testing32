const express = require('express')
const app = express()
let pizzas = require("./pizzas.json")
let boxes = require("./boxes.json")
let vouchers = require("./vouchers.json")
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.json());

function getPrideStates(){
  let states = []
  for(let box of boxes){
    if(box.tier === 'pride' && box.state !== 'default'){
      states.push(box)
    }
  }
  return states
}

app.get('/pizza/list', function(req, resp){
  console.log('getting all pizzas')
  resp.send(pizzas)
})

app.post('/pizza/new', function(req, resp){
  console.log('adding new pizza', req.body)
  let newPizza = req.body

  let maxId = 0
  for(let pizza of pizzas){
    if(pizza.id > maxId){
      maxId = pizza.id
    }
  }
  newPizza.id = maxId + 1
  newPizza.price = parseFloat(newPizza.price)
  newPizza.toppings = []
  pizzas.push(newPizza)

  if(!app.TESTING){
    fs.writeFileSync('./pizzas.json', JSON.stringify(pizzas))
  }
  resp.send(pizzas)
})

app.post('/pizza/remove', function(req, resp){
  console.log('removing pizza', req.body)
  let id = req.body.id
  let remainingPizzas = []
  for(let pizza of pizzas){
    if(pizza.id !== id){
      remainingPizzas.push(pizza)
    }
  }
  pizzas = remainingPizzas

  if(!app.TESTING){
    fs.writeFileSync('./pizzas.json', JSON.stringify(pizzas))
  }
  resp.send(pizzas)
})

app.get('/state/list', function(req, resp){
  console.log('getting all states')
  resp.send(getPrideStates())
})

app.get('/voucher/list', function(req, resp){
  console.log('getting all vouchers')
  resp.send(vouchers)
})

app.post('/state/new', function(req, resp){
  console.log('adding new state', req.body)
  let newState = req.body

  let maxId = 0
  for(let box of boxes){
    if(box.id > maxId){
      maxId = box.id
    }
  }
  newState.id = maxId + 1
  newState.tier = 'pride'
  newState.state = req.body.name
  newState.name = `${req.body.name} Pride Box`
  newState.extraCheese = true
  boxes.push(newState)

  if(!app.TESTING){
    fs.writeFileSync('./boxes.json', JSON.stringify(boxes))
  }
  resp.send(getPrideStates())
})

app.post('/state/remove', function(req, resp){
  console.log('removing state', req.body)
  let id = req.body.id
  let remainingBoxes = []
  for(let box of boxes){
    if(box.id !== id){
      remainingBoxes.push(box)
    }
  }
  boxes = remainingBoxes

  if(!app.TESTING){
    fs.writeFileSync('./boxes.json', JSON.stringify(boxes))
  }
  resp.send(getPrideStates())
})

module.exports = app;
