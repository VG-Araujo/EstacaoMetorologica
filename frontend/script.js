const inp = document.getElementById("inp");
const dropCont = document.getElementById("dropcont");
//Adicionar um mecanismo de busca de cidades com autocomplete

function toggleMenu() {
  const estacao = document.getElementsByClassName("estacao")[0];
  let navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
  if (navLinks.classList.contains("show")) {
    estacao.style.marginTop = "80px";
  } else {
    estacao.style.marginTop = "20px";
  }
}

function toggleCity() {
  dropCont.classList.toggle("show1");
}

async function cidade() {
  try {
    const cidade = document.getElementById("cidade");
    const clima = document.getElementById("clima");
    const temperatura = document.getElementById("temperatura");
    const umidade = document.getElementById("umidade");
    const pressao = document.getElementById("pressao");
    const value = inp.value;
    if (!value || !isNaN(value)) {
      alert("Digite um nome de cidade válido.");
      inp.value = "";
      return;
    }

    const response = await fetch(`http://localhost:3030/busca/${value}`);

    if (!response.ok) {
      throw new Error("Cidade não encontrada");
    }
    const dados = await response.json();
    cidade.innerHTML = dados.name || "--";
    clima.innerHTML = dados.weather[0].description || "--";
    temperatura.innerHTML = `${dados.main.temp}℃` || "--";
    pressao.innerHTML = `${dados.main.pressure}bPa` || "--";
    umidade.innerHTML = `${dados.main.humidity}%` || "--";
    inp.value = "";
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("keydown", (e) => {
  if (dropCont.classList.contains("show1") && e.key === "Enter") {
    e.preventDefault();
    cidade();
  }
});
