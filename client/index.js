function displayPizzas(pizzaList){
  let row = document.getElementById('pizza-row')
  if(!row){
    return;
  }
  row.innerHTML = ""
  for(let pizza of pizzaList){
    let pizzaString = `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${pizza.fancyImageURL}" class="card-img-top" alt="${pizza.name}">
                <div class="card-body">
                  <h5 class="card-title">${pizza.name}</h5>
                  <p class="card-text">$${pizza.price.toFixed(2)}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary edit-btn" data-pizza-id="${pizza.id}">Edit</button>
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

function openEditModal(pizza){
  currentPizza = pizza
  document.getElementById('modal-pizza-name').textContent = pizza.name
  document.getElementById('modal-pizza-image').src = pizza.imageURL
  document.getElementById('modal-pizza-image').alt = pizza.name
  document.getElementById('modal-pizza-price').textContent = pizza.price.toFixed(2)

  document.getElementById('modal-xtra-cheese-check').checked = false
  document.getElementById('modal-pride-check').checked = false
  document.getElementById('modal-state-select').value = ''
  document.getElementById('modal-note').value = ''
  updateModalBoxImage()

  let modal = new bootstrap.Modal(document.getElementById('edit-pizza-modal'))
  modal.show()
}

function displayChefs(stateList){
  let row = document.getElementById('chef-row')
  if(!row){
    return;
  }
  row.innerHTML = ""

  let universities = ['University of Palermo', 'University of Catania', 'University of Messina', 'Kore University of Enna']
  let sicilyPlaces = ['the beaches of Taormina', 'the markets of Palermo', 'the streets of Catania', 'the cliffs of Cefalù', 'the vineyards near Trapani', 'the harbor of Syracuse']
  let chefPhotos = ['media/chef1.jpg', 'media/chef2.jpg', 'media/chef3.jpeg']

  let i = 0
  for(let state of stateList){
    let university = universities[i % universities.length]
    let place = sicilyPlaces[i % sicilyPlaces.length]
    let photo = chefPhotos[i % chefPhotos.length]
    let chefString = `
        <div class="col">
            <div class="card shadow-sm">
                <img src="${photo}" class="card-img-top" alt="Chef of ${state.state}">
                <div class="card-body">
                  <h5 class="card-title">Chef of ${state.state}</h5>
                  <p class="card-text">Trained at ${university}, this chef's heart belongs to ${place} back in Sicily.</p>
                </div>
              </div>
          </div>`
    row.innerHTML += chefString
    i = i + 1
  }
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

function checkAdminLogin(){
  let adminLinkContainer = document.getElementById('admin-link-container')
  if(!adminLinkContainer){
    return;
  }
  if(localStorage.getItem('isAdmin') === 'true'){
    adminLinkContainer.classList.remove('d-none')
  }
}

function attemptAdminLogin(){
  let username = document.getElementById('admin-username').value
  let password = document.getElementById('admin-password').value

  if(username === '1' && password === '1'){
    localStorage.setItem('isAdmin', 'true')
    checkAdminLogin()
    let modal = bootstrap.Modal.getInstance(document.getElementById('admin-login-modal'))
    if(modal){
      modal.hide()
    }
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
    price: currentPizza.price,
    box: currentBoxLabel,
    note: document.getElementById('modal-note').value
  })
  saveCart(cart)
}

window.addEventListener("DOMContentLoaded", async function(event){
  let pizzaResponse = await fetch('/pizza/list')
  pizzaList = await pizzaResponse.json()
  displayPizzas(pizzaList)

  let stateResponse = await fetch('/state/list')
  stateList = await stateResponse.json()
  populateStateSelect()
  displayChefs(stateList)

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
  })

  document.getElementById('modal-xtra-cheese-check').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-pride-check').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-state-select').addEventListener('change', updateModalBoxImage)
  document.getElementById('modal-add-to-cart-btn').addEventListener('click', addCurrentPizzaToCart)

  checkAdminLogin()
  document.getElementById('admin-login-btn').addEventListener('click', attemptAdminLogin)

  updateFooterLogo()
  let themeButtons = document.querySelectorAll('[data-bs-theme-value]')
  for(let button of themeButtons){
    button.addEventListener('click', updateFooterLogo)
  }
})
