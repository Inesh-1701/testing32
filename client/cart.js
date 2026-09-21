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

function clampPrice(price){
  if(price < 0){
    return 0
  }
  return price
}
