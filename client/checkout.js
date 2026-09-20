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
