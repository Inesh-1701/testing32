function validateForm(form){
  form.addEventListener('submit', function(event){
    if(!form.checkValidity()){
      event.preventDefault()
      event.stopPropagation()
    }
    form.classList.add('was-validated')
  })
}

let forms = document.querySelectorAll('.needs-validation')
for(let form of forms){
  validateForm(form)
}

function displayCart(){
  let cart = getCart()
  let list = document.getElementById('cart-items')
  if(!list){
    return;
  }
  list.innerHTML = ""
  let total = 0

  for(let item of cart){
    total += item.price

    let noteHtml = ""
    if(item.note){
      noteHtml = `<br><small class="text-body-secondary fst-italic">Note: ${item.note}</small>`
    }

    let itemString = `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${item.name}</h6>
          <small class="text-body-secondary">${item.box}</small>
          ${noteHtml}
        </div>
        <div class="text-end">
          <span class="text-body-secondary d-block">$${item.price.toFixed(2)}</span>
          <button type="button" class="btn btn-sm btn-outline-danger remove-item-btn" data-item-id="${item.id}">Remove</button>
        </div>
      </li>`
    list.innerHTML += itemString
  }

  list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
      <span>Total (USD)</span> <strong id="cart-total">$${total.toFixed(2)}</strong>
    </li>`

  document.getElementById('cart-count').textContent = cart.length
}

let cartList = document.getElementById('cart-items')
if(cartList){
  cartList.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-item-btn')){
      let itemId = parseInt(event.target.dataset.itemId)
      let cart = getCart()
      let newCart = []
      for(let item of cart){
        if(item.id !== itemId){
          newCart.push(item)
        }
      }
      saveCart(newCart)
      displayCart()
    }
  })
  displayCart()
}
