const inp = document.getElementById("inp");
const dropCont = document.getElementById("dropcont");
//Adicionar um mecanismo de busca de cidades com autocomplete

function toggleMenu() {
  const estacao = document.getElementsByClassName("estacao")[0];
  let navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
  if (navLinks.classList.contains("show")) {
    estacao.style.marginTop = "160px";
  } else {
    estacao.style.marginTop = "80px";
  }
}

function toggleCity() {
  dropCont.classList.toggle("show1");
}

async function cidade() {
  try {
    const cidade = document.getElementById("cidade");
    const clima = document.getElementById("clima");
    const temp_max = document.getElementById("temp_max");
    const temp_min = document.getElementById("temp_min");
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
    temp_max.innerHTML = `${dados.main.temp_max}℃` || "--";
    temp_min.innerHTML = `${dados.main.temp_min}℃` || "--";
    inp.value = "";
    if (dropCont.classList.contains("show1")) {
      dropCont.classList.toggle("show1");
    }
  } catch (error) {
    console.log(error);
  }
}

async function DadosEsp() {
  try {
    const temperatura = document.getElementById("temperatura");
    const umidade = document.getElementById("umidade");
    const pressao = document.getElementById("pressao");
    const response = await fetch("http://localhost:3030/dados/esp");
    if (!response.ok) throw new Error("dados não encontrados");

    const dados = await response.json();
    temperatura.innerHTML = `${dados.temperatura}℃` || "--";
    umidade.innerHTML = `${dados.umidade}%` || "--";
    pressao.innerHTML = `${dados.pressao}bPa` || "--";
  } catch (error) {
    console.log(error);
  }
}
DadosEsp();
setInterval(DadosEsp, 10000);

document.addEventListener("keydown", (e) => {
  if (dropCont.classList.contains("show1") && e.key === "Enter") {
    e.preventDefault();
    cidade();
  }
});
