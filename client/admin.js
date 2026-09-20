function displayPizzasAdmin(pizzaList){
  let list = document.getElementById('pizza-admin-list')
  if(!list){
    return;
  }
  list.innerHTML = ""
  for(let pizza of pizzaList){
    let itemString = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${pizza.name}</strong>
          <span class="text-body-secondary"> $${pizza.price.toFixed(2)}</span>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger remove-pizza-btn" data-pizza-id="${pizza.id}">Remove</button>
      </li>`
    list.innerHTML += itemString
  }
}

function displayStatesAdmin(stateList){
  let list = document.getElementById('state-admin-list')
  if(!list){
    return;
  }
  list.innerHTML = ""
  for(let state of stateList){
    let itemString = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${state.state}</span>
        <button type="button" class="btn btn-sm btn-outline-danger remove-state-btn" data-state-id="${state.id}">Remove</button>
      </li>`
    list.innerHTML += itemString
  }
}

async function loadPizzas(){
  let response = await fetch('/pizza/list')
  let pizzaList = await response.json()
  displayPizzasAdmin(pizzaList)
}

async function loadStates(){
  let response = await fetch('/state/list')
  let stateList = await response.json()
  displayStatesAdmin(stateList)
}

window.addEventListener("DOMContentLoaded", async function(event){
  loadPizzas()
  loadStates()

  let pizzaAdminList = document.getElementById('pizza-admin-list')
  pizzaAdminList.addEventListener('click', async function(event){
    if(event.target.classList.contains('remove-pizza-btn')){
      let pizzaId = parseInt(event.target.dataset.pizzaId)
      let response = await fetch('/pizza/remove', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pizzaId })
      })
      if(response.ok){
        loadPizzas()
      }
      else{
        alert('Problem removing pizza ' + response.statusText)
      }
    }
  })

  let stateAdminList = document.getElementById('state-admin-list')
  stateAdminList.addEventListener('click', async function(event){
    if(event.target.classList.contains('remove-state-btn')){
      let stateId = parseInt(event.target.dataset.stateId)
      let response = await fetch('/state/remove', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: stateId })
      })
      if(response.ok){
        loadStates()
      }
      else{
        alert('Problem removing state ' + response.statusText)
      }
    }
  })

  let newPizzaForm = document.getElementById('new-pizza-form')
  newPizzaForm.addEventListener('submit', async function(event){
    event.preventDefault()
    let formData = new FormData(newPizzaForm)
    let newPizza = Object.fromEntries(formData.entries())
    let response = await fetch('/pizza/new', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPizza)
    })
    if(response.ok){
      newPizzaForm.reset()
      loadPizzas()
    }
    else{
      alert('Problem adding pizza ' + response.statusText)
    }
  })

  let newStateForm = document.getElementById('new-state-form')
  newStateForm.addEventListener('submit', async function(event){
    event.preventDefault()
    let formData = new FormData(newStateForm)
    let newState = Object.fromEntries(formData.entries())
    let response = await fetch('/state/new', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newState)
    })
    if(response.ok){
      newStateForm.reset()
      loadStates()
    }
    else{
      alert('Problem adding state ' + response.statusText)
    }
  })
})
