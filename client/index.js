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
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
          </div>`
    row.innerHTML += pizzaString
  }
}

window.addEventListener("DOMContentLoaded", async function(event){
  let pizzaResponse = await fetch('/pizza/list')
  let pizzaList = await pizzaResponse.json()
  displayPizzas(pizzaList)
})
