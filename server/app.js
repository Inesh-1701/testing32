const express = require('express')
const app = express()
let pizzas = require("./pizzas.json")
let states = require("./states.json")
let vouchers = require("./vouchers.json")
let toppings = require("./toppings.json")
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.json());

function findPizzaById(id){
  for(let pizza of pizzas){
    if(pizza.id === id){
      return pizza
    }
  }
  return null
}

function findToppingById(id){
  for(let topping of toppings){
    if(topping.id === id){
      return topping
    }
  }
  return null
}

function pizzaWithToppingDetails(pizza){
  let toppingDetails = []
  for(let toppingId of pizza.toppings){
    let topping = findToppingById(toppingId)
    if(topping){
      toppingDetails.push(topping)
    }
  }
  return {
    id: pizza.id,
    name: pizza.name,
    price: pizza.price,
    imageURL: pizza.imageURL,
    fancyImageURL: pizza.fancyImageURL,
    toppings: toppingDetails
  }
}

app.get('/pizza/list', function(req, resp){
  console.log('getting all pizzas')
  resp.send(pizzas)
})

app.get('/pizza/detail/:id', function(req, resp){
  console.log('getting an individual pizza')
  let id = parseInt(req.params.id)
  if(isNaN(id)){
    resp.status(400).send('invalid pizza id')
    return
  }
  let pizza = findPizzaById(id)
  if(!pizza){
    resp.status(400).send('pizza not found')
    return
  }
  resp.send(pizzaWithToppingDetails(pizza))
})

app.post('/pizza/new', function(req, resp){
  console.log('adding new pizza', req.body)
  let newPizza = req.body

  if(!newPizza.name || newPizza.price === undefined || !newPizza.imageURL || !newPizza.fancyImageURL){
    resp.status(400).send('missing required pizza fields')
    return
  }

  let price = parseFloat(newPizza.price)
  if(isNaN(price)){
    resp.status(400).send('invalid price')
    return
  }

  let toppingIds = newPizza.toppings || []
  let toppingIdInts = []
  for(let toppingId of toppingIds){
    let toppingIdInt = parseInt(toppingId)
    if(!findToppingById(toppingIdInt)){
      resp.status(400).send('unknown topping id ' + toppingId)
      return
    }
    toppingIdInts.push(toppingIdInt)
  }

  let maxId = 0
  for(let pizza of pizzas){
    if(pizza.id > maxId){
      maxId = pizza.id
    }
  }
  newPizza.id = maxId + 1
  newPizza.price = price
  newPizza.toppings = toppingIdInts
  pizzas.push(newPizza)

  // kept in memory only, so the seed pizzas.json file is never overwritten
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

  // kept in memory only, so the seed pizzas.json file is never overwritten
  resp.send(pizzas)
})

app.get('/topping/list', function(req, resp){
  console.log('getting all toppings')
  resp.send(toppings)
})

app.get('/topping/detail/:id', function(req, resp){
  console.log('getting an individual topping')
  let id = parseInt(req.params.id)
  if(isNaN(id)){
    resp.status(400).send('invalid topping id')
    return
  }
  let topping = findToppingById(id)
  if(!topping){
    resp.status(400).send('topping not found')
    return
  }
  resp.send(topping)
})

app.get('/state/list', function(req, resp){
  console.log('getting all states')
  resp.send(states)
})

app.get('/voucher/list', function(req, resp){
  console.log('getting all vouchers')
  resp.send(vouchers)
})

app.post('/state/new', function(req, resp){
  console.log('adding new state', req.body)
  let newState = req.body

  let maxId = 0
  for(let state of states){
    if(state.id > maxId){
      maxId = state.id
    }
  }
  newState.id = maxId + 1
  states.push(newState)

  // kept in memory only, so the seed states.json file is never overwritten
  resp.send(states)
})

app.post('/state/remove', function(req, resp){
  console.log('removing state', req.body)
  let id = req.body.id
  let remainingStates = []
  for(let state of states){
    if(state.id !== id){
      remainingStates.push(state)
    }
  }
  states = remainingStates

  // kept in memory only, so the seed states.json file is never overwritten
  resp.send(states)
})

module.exports = app;
