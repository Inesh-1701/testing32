function displayPizzas(pizzaList){
  let row = document.getElementById('pizza-row')
  if(!row){
    return;
  }
  let cardDescription = document.getElementById('pizza-card-description').innerHTML
  row.innerHTML = ""
  for(let pizza of pizzaList){
    let pizzaString = `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${pizza.fancyImageURL}" class="card-img-top" alt="${pizza.name}">
                <div class="card-body">
                  <h5 class="card-title">${pizza.name}</h5>
                  <p class="card-text">$${pizza.price.toFixed(2)}</p>
                  <p class="card-text text-body-secondary fst-italic">${cardDescription}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary view-btn" data-pizza-id="${pizza.id}">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary edit-btn" data-pizza-id="${pizza.id}">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
          </div>`
    row.innerHTML += pizzaString
  }
}

let pizzaList = []
let stateList = []
let toppingList = []
let currentPizza = null
let currentBoxLabel = 'Regular Box'

function populateStateSelect(){
  let select = document.getElementById('modal-state-select')
  for(let state of stateList){
    let option = document.createElement('option')
    option.value = state.state
    option.textContent = state.state
    select.appendChild(option)
  }
}

function updateModalBoxImage(){
  let xtraCheeseChecked = document.getElementById('modal-xtra-cheese-check').checked
  let prideChecked = document.getElementById('modal-pride-check').checked
  let selectedState = document.getElementById('modal-state-select').value

  let boxImage = 'media/pizzabox.jpeg'
  let boxLabel = 'Regular Box'

  if(xtraCheeseChecked){
    boxImage = 'media/pizzabox_xtracheese.jpeg'
    boxLabel = 'Xtra Cheese Box'
  }

  if(prideChecked){
    boxImage = 'media/pizzabox_pride_default.jpeg'
    boxLabel = 'Pride Box'
    for(let state of stateList){
      if(state.state === selectedState){
        boxImage = state.imageURL
        boxLabel = state.state + ' Pride Box'
      }
    }
  }

  document.getElementById('modal-box-image').src = boxImage
  currentBoxLabel = boxLabel
}

function isToppingIdInList(toppingId, toppingIdList){
  for(let id of toppingIdList){
    if(id === toppingId){
      return true
    }
  }
  return false
}

function populateToppingChecklist(pizza){
  let container = document.getElementById('modal-toppings-list')
  container.innerHTML = ""
  for(let topping of toppingList){
    let checkedAttribute = ""
    if(isToppingIdInList(topping.id, pizza.toppings)){
      checkedAttribute = "checked"
    }
    let toppingString = `
      <div class="col form-check">
        <input class="form-check-input modal-topping-check" type="checkbox" id="modal-topping-${topping.id}" data-topping-id="${topping.id}" ${checkedAttribute}>
        <label class="form-check-label" for="modal-topping-${topping.id}">${topping.name}</label>
      </div>`
    container.innerHTML += toppingString
  }
}

function calculateModalPrice(){
  let priceAdjustment = 0
  let checkboxes = document.querySelectorAll('.modal-topping-check')
  for(let checkbox of checkboxes){
    let toppingId = parseInt(checkbox.dataset.toppingId)
    let wasOriginal = isToppingIdInList(toppingId, currentPizza.toppings)
    if(checkbox.checked && !wasOriginal){
      priceAdjustment += 1
    }
    if(!checkbox.checked && wasOriginal){
      priceAdjustment -= 1
    }
  }
  return clampPrice(currentPizza.price + priceAdjustment)
}

function updateModalPrice(){
  document.getElementById('modal-pizza-price').textContent = calculateModalPrice().toFixed(2)
}

function openEditModal(pizza){
  currentPizza = pizza
  document.getElementById('modal-pizza-name').textContent = pizza.name
  document.getElementById('modal-pizza-image').src = pizza.imageURL
  document.getElementById('modal-pizza-image').alt = pizza.name

  document.getElementById('modal-xtra-cheese-check').checked = false
  document.getElementById('modal-pride-check').checked = false
  document.getElementById('modal-state-select').value = ''
  document.getElementById('modal-note').value = ''
  populateToppingChecklist(pizza)
  updateModalPrice()
  updateModalBoxImage()

  let modal = new bootstrap.Modal(document.getElementById('edit-pizza-modal'))
  modal.show()
}

async function openViewModal(pizza){
  document.getElementById('view-pizza-name').textContent = pizza.name
  document.getElementById('view-pizza-image').src = pizza.fancyImageURL
  document.getElementById('view-pizza-image').alt = pizza.name

  let response = await fetch('/pizza/detail/' + pizza.id)
  let pizzaDetail = await response.json()

  let toppingsList = document.getElementById('view-pizza-toppings')
  toppingsList.innerHTML = ""
  for(let topping of pizzaDetail.toppings){
    let item = document.createElement('li')
    item.textContent = topping.name
    toppingsList.appendChild(item)
  }

  let modal = new bootstrap.Modal(document.getElementById('view-pizza-modal'))
  modal.show()
}

function updateFooterLogo(){
  let logo = document.getElementById('footer-logo')
  if(!logo){
    return;
  }
  let theme = document.documentElement.getAttribute('data-bs-theme')
  if(theme === 'dark'){
    logo.src = 'media/logo_Dark.png'
  }
  else{
    logo.src = 'media/logo_Light.png'
  }
}

function attemptAdminLogin(){
  let username = document.getElementById('admin-username').value
  let password = document.getElementById('admin-password').value

  if(username === '1' && password === '1'){
    window.location.href = 'admin.html'
  }
  else{
    alert('Incorrect username or password')
  }
}

function addCurrentPizzaToCart(){
  if(!currentPizza){
    return;
  }
  let cart = getCart()
  cart.push({
    id: Date.now(),
    name: currentPizza.name,
    price: calculateModalPrice(),
    box: currentBoxLabel,
    note: document.getElementById('modal-note').value
  })
  saveCart(cart)
}

function setFulfillmentType(fulfillmentType, label){
  localStorage.setItem('fulfillmentType', fulfillmentType)
  document.getElementById('fulfillment-btn').textContent = label
}

function applyStoredFulfillmentType(){
  let fulfillmentType = localStorage.getItem('fulfillmentType')
  if(fulfillmentType === 'pickup'){
    document.getElementById('fulfillment-btn').textContent = 'To Collect'
  }
  else{
    document.getElementById('fulfillment-btn').textContent = 'It Delivered'
  }
}

async function displayAvailableCoupons(){
  let textElement = document.getElementById('voucher-list-text')
  if(!textElement){
    return;
  }
  let response = await fetch('/voucher/list')
  let vouchers = await response.json()
  let couponText = "Available coupons: "
  for(let voucher of vouchers){
    couponText += voucher.code + ", "
  }
  textElement.textContent = couponText.slice(0, -2)
}

window.addEventListener("DOMContentLoaded", async function(event){
  let pizzaResponse = await fetch('/pizza/list')
  pizzaList = await pizzaResponse.json()
  displayPizzas(pizzaList)

  let stateResponse = await fetch('/state/list')
  stateList = await stateResponse.json()
  populateStateSelect()

  let toppingResponse = await fetch('/topping/list')
  toppingList = await toppingResponse.json()

  displayAvailableCoupons()

  let row = document.getElementById('pizza-row')
  row.addEventListener('click', function(event){
    if(event.target.classList.contains('edit-btn')){
      let pizzaId = parseInt(event.target.dataset.pizzaId)
      for(let pizza of pizzaList){
        if(pizza.id === pizzaId){
          openEditModal(pizza)
        }
      }
    }
    if(event.target.classList.contains('view-btn')){
      let pizzaId = parseInt(event.target.dataset.pizzaId)
      for(let pizza of pizzaList){
        if(pizza.id === pizzaId){
          openViewModal(pizza)
        }
      }
    }
  })

  document.getElementById('modal-xtra-cheese-check').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-pride-check').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-state-select').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-add-to-cart-btn').addEventListener('click', addCurrentPizzaToCart)
  document.getElementById('modal-toppings-list').addEventListener('change', function(event){
    if(event.target.classList.contains('modal-topping-check')){
      updateModalPrice()
    }
  })

  applyStoredFulfillmentType()
  let fulfillmentOptions = document.querySelectorAll('.fulfillment-option')
  for(let option of fulfillmentOptions){
    option.addEventListener('click', function(event){
      setFulfillmentType(event.target.dataset.fulfillment, event.target.textContent)
    })
  }

  document.getElementById('admin-login-btn').addEventListener('click', attemptAdminLogin)
  document.getElementById('admin-link').addEventListener('click', function(event){
    event.preventDefault()
    let modal = new bootstrap.Modal(document.getElementById('admin-login-modal'))
    modal.show()
  })

  updateFooterLogo()
  let themeButtons = document.querySelectorAll('[data-bs-theme-value]')
  for(let button of themeButtons){
    button.addEventListener('click', updateFooterLogo)
  }
})
