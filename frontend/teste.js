const dados = {
    temperatura: 85,
    umidade: 5,
    pressao: 550
}

fetch("https://estacaometorologica.onrender.com/dados/esp", {
    method: "POST",
    headers: {"Content-Type": "Application/json"},
    body: JSON.stringify(dados)
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error =>{
    console.error(error)
  })