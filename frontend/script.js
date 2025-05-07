const inp = document.getElementById("inp");
const dropCont = document.getElementById("dropcont");
let chart; // gráfico global

//Adicionar um mecanismo de busca de cidades com autocomplete

let dadosGrafico = {
  labels: ["Agora"], // você pode adicionar mais rótulos de tempo
  datasets: [
    {
      label: "Temperatura ESP32",
      data: [],
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "Temperatura Cidade",
      data: [],
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
      fill: false,
    },
  ],
};

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
    const cidadeSpan = document.getElementById("cidade");
    const clima = document.getElementById("clima");
    const temp_max = document.getElementById("temp_max");
    const temp_min = document.getElementById("temp_min");
    const value = inp.value.trim();

    if (!value || !isNaN(value)) {
      alert("Digite um nome de cidade válido.");
      inp.value = "";
      return;
    }

    const response = await fetch(`https://localhost:3030/busca/${value}`);

    if (!response.ok) {
      throw new Error("Cidade não encontrada");
    }

    const dados = await response.json();

    cidadeSpan.innerHTML = dados.name || "--";
    clima.innerHTML = dados.weather[0].description || "--";
    temp_max.innerHTML = `${dados.main.temp_max}℃` || "--";
    temp_min.innerHTML = `${dados.main.temp_min}℃` || "--";
    temperaturaCidade = dados.main.temp;

    // Perguntar se deseja salvar como padrão
    if (confirm(`Deseja salvar "${dados.name}" como cidade padrão?`)) {
      localStorage.setItem("cidadePadrao", dados.name);
    }

    inp.value = "";
    if (dropCont.classList.contains("show1")) {
      dropCont.classList.remove("show1");
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

    const response = await fetch("https://localhost:3030/dados/esp");
    if (!response.ok) throw new Error("dados não encontrados");

    const dados = await response.json();
    const tempESP = parseFloat(dados.temperatura);

    temperatura.innerHTML = `${tempESP}℃` || "--";
    umidade.innerHTML = `${dados.umidade}%` || "--";
    pressao.innerHTML = `${dados.pressao}bPa` || "--";

    if (temperaturaCidade !== null) {
      criarOuAtualizarGrafico(tempESP, temperaturaCidade);
    }
  } catch (error) {
    console.log(error);
  }
}

function criarOuAtualizarGrafico(tempESP, tempCidade) {
  const ctx = document.getElementById("graficoComparativo").getContext("2d");

  // Se o gráfico já existir, atualiza os dados
  if (chart) {
    chart.data.datasets[0].data.push(tempESP);
    chart.data.datasets[1].data.push(tempCidade);
    chart.data.labels.push(new Date().toLocaleTimeString());

    if (chart.data.labels.length > 10) {
      // Mantém só os últimos 10 pontos
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
      chart.data.datasets[1].data.shift();
    }

    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: "line",
      data: dadosGrafico,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Comparativo de Temperatura ESP32 vs Cidade",
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
    // Adiciona os primeiros valores
    chart.data.datasets[0].data.push(tempESP);
    chart.data.datasets[1].data.push(tempCidade);
  }
}

if (temperaturaCidade !== null) {
  criarOuAtualizarGrafico(tempESP, temperaturaCidade);
  document.getElementById("grafico-status").style.display = "none";
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

window.onload = function () {
  const ctx = document.getElementById("graficoComparativo").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: dadosGrafico,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Comparativo de Temperatura ESP32 vs Cidade",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });

  // Se houver cidade salva, busca automaticamente
  const cidadeSalva = localStorage.getItem("cidadePadrao");
  if (cidadeSalva) {
    inp.value = cidadeSalva;
    cidade(); // chama a função para buscar
  }
};
