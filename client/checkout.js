function validateForm(form){
  form.addEventListener('submit', function(event){
    event.preventDefault()
    if(!form.checkValidity()){
      event.stopPropagation()
    }
    else{
      saveCart([])
      let modalElement = document.getElementById('order-received-modal')
      let modal = new bootstrap.Modal(modalElement)
      modal.show()
      modalElement.addEventListener('hidden.bs.modal', function(){
        window.location.href = 'index.html'
      })
    }
    form.classList.add('was-validated')
  })
}

let forms = document.querySelectorAll('.needs-validation')
for(let form of forms){
  validateForm(form)
}

let appliedVoucher = null

async function findVoucherByCode(code){
  let response = await fetch('/voucher/list')
  let vouchers = await response.json()
  for(let voucher of vouchers){
    if(voucher.code.toLowerCase() === code.toLowerCase()){
      return voucher
    }
  }
  return null
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

  if(appliedVoucher){
    total = total - appliedVoucher.value
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
        <div class="text-success">
          <h6 class="my-0">Voucher</h6>
          <small>${appliedVoucher.code}</small>
        </div>
        <span class="text-success">&minus;$${appliedVoucher.value.toFixed(2)}</span>
      </li>`
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

let voucherForm = document.getElementById('voucher-form')
if(voucherForm){
  voucherForm.addEventListener('submit', async function(event){
    event.preventDefault()
    let code = document.getElementById('voucher-input').value
    let voucher = await findVoucherByCode(code)
    if(voucher){
      appliedVoucher = voucher
      displayCart()
    }
    else{
      alert('Invalid voucher code')
    }
  })
}
