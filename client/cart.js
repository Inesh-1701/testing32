function getCart(){
  let cartJSON = localStorage.getItem('cart')
  if(!cartJSON){
    return []
  }
  return JSON.parse(cartJSON)
}

function saveCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart))
}
