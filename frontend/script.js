const inp = document.getElementById("inp");
const dropCont = document.getElementById("dropcont");
//Adicionar um mecanismo de busca de cidades com autocomplete

//Função para abrir navbar
function toggleMenu() {
  const estacao = document.getElementsByClassName("estacao")[0];
  let navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
  //Garantindo que o navbar não oculte parte da estação
  if (navLinks.classList.contains("show")) {
    estacao.style.marginTop = "160px";
  } else {
    estacao.style.marginTop = "80px";
  }
}

//Função para abrir o input para buscar cidades
function toggleCity() {
  dropCont.classList.toggle("show1");
}

//Buscar dados da API
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
    //IP onde se encontra a rota para buscar dados
    const response = await fetch(`https://exemplo.com.br/busca/${value}`);

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

//Buscar dados recebidos do ESP
async function DadosEsp() {
  try {
    const temperatura = document.getElementById("temperatura");
    const umidade = document.getElementById("umidade");
    const pressao = document.getElementById("pressao");
    //IP para rota de buscar dados do ESP
    const response = await fetch("https://exemplo.com.br/dados/esp");
    if (!response.ok) throw new Error("dados não encontrados");

    const dados = await response.json();
    temperatura.innerHTML = `${dados.temperatura}℃` || "--";
    umidade.innerHTML = `${dados.umidade}%` || "--";
    pressao.innerHTML = `${dados.pressao}bPa` || "--";
  } catch (error) {
    console.log(error);
  }
}
//Chamar os dados do ESP logo quando entrar
DadosEsp();
//Rechamar os dados a cada 1 minuto
setInterval(DadosEsp, 60000);

//Chamar a função cidade quando digitar uma cidade no input e apertar ENTER
document.addEventListener("keydown", (e) => {
  if (dropCont.classList.contains("show1") && e.key === "Enter") {
    e.preventDefault();
    cidade();
  }
});
