let grafico = null;
const historico = [];

/* =======================
   Alternar Tema
======================= */
document.getElementById("temaBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (grafico) gerarGraficoUltimo();
});

/* =======================
   Cálculo de Bhaskara
======================= */
function calcularBhaskara() {
    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    const c = Number(document.getElementById("c").value);
    const erro = document.getElementById("erro");
    const explicacao = document.getElementById("explicacaoComplexa");

    erro.textContent = "";
    explicacao.textContent = "";

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        erro.textContent = "Todos os valores precisam ser números.";
        return;
    }

    if (a === 0) {
        erro.textContent = "O coeficiente A não pode ser zero em uma equação quadrática.";
        return;
    }

    const delta = b * b - 4 * a * c;
    let x1, x2;

    if (delta < 0) {
        explicacao.textContent =
            "Delta negativo. As raízes são complexas e não aparecem no gráfico como interceptações reais do eixo X.";
        x1 = `${-b / (2 * a)} + ${Math.sqrt(-delta) / (2 * a)}i`;
        x2 = `${-b / (2 * a)} - ${Math.sqrt(-delta) / (2 * a)}i`;
    } else {
        x1 = (-b + Math.sqrt(delta)) / (2 * a);
        x2 = (-b - Math.sqrt(delta)) / (2 * a);
    }

    preencherTabela(delta, x1, x2);
    adicionarAoHistorico(a, b, c, x1, x2);
    gerarGrafico(a, b, c, x1, x2, delta);
}

function preencherTabela(delta, x1, x2) {
    const tbody = document.querySelector("#tabelaResultado tbody");
    tbody.innerHTML = `
        <tr>
            <td>${delta}</td>
            <td>${x1}</td>
            <td>${x2}</td>
        </tr>
    `;
}

function adicionarAoHistorico(a, b, c, x1, x2) {
    historico.push({ a, b, c, x1, x2 });

    const lista = document.getElementById("historicoLista");
    lista.innerHTML = "";

    historico.forEach(item => {
        lista.innerHTML += `
            <tr>
                <td>${item.a}</td>
                <td>${item.b}</td>
                <td>${item.c}</td>
                <td>${item.x1}</td>
                <td>${item.x2}</td>
            </tr>
        `;
    });
}

/* =======================
   Gráfico
======================= */
function gerarGrafico(a, b, c, x1, x2, delta) {
    const ctx = document.getElementById("grafico");

    if (grafico) grafico.destroy();

    const pontos = [];
    for (let x = -20; x <= 20; x += 0.5) {
        pontos.push({ x: x, y: a * x * x + b * x + c });
    }

    const marcadores = [];
    if (delta >= 0) {
        marcadores.push({ x: x1, y: 0 });
        marcadores.push({ x: x2, y: 0 });
    }

    const modoEscuro = document.body.classList.contains("dark");

    const corParabola = modoEscuro ? "white" : "black";
    const corRaizes = modoEscuro ? "yellow" : "red";

    grafico = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Parábola",
                    data: pontos,
                    showLine: true,
                    borderColor: corParabola,
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "Raízes",
                    data: marcadores,
                    pointRadius: 6,
                    backgroundColor: corRaizes,
                    borderColor: corRaizes
                }
            ],
        },
        options: {
            scales: {
                x: { type: "linear", position: "bottom" },
                y: { type: "linear" }
            }
        }
    });

    ultimo = { a, b, c, x1, x2, delta };
}

function gerarGraficoUltimo() {
    if (ultimo) gerarGrafico(ultimo.a, ultimo.b, ultimo.c, ultimo.x1, ultimo.x2, ultimo.delta);
}

let ultimo = null;

/* =======================
   Entrada por Voz
======================= */
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const reconhecimento = new SpeechRecognition();
reconhecimento.lang = "pt-BR";
reconhecimento.continuous = false;
reconhecimento.interimResults = false;

document.getElementById("vozBtn").addEventListener("click", () => {
    reconhecimento.start();
});

reconhecimento.onresult = function(event) {
    const frase = event.results[0][0].transcript.toLowerCase();

    const valorA = frase.match(/a\s*(igual\s*a)?\s*(-?\d+[\.,]?\d*)/);
    const valorB = frase.match(/b\s*(igual\s*a)?\s*(-?\d+[\.,]?\d*)/);
    const valorC = frase.match(/c\s*(igual\s*a)?\s*(-?\d+[\.,]?\d*)/);

    if (valorA) document.getElementById("a").value = valorA[2].replace(",", ".");
    if (valorB) document.getElementById("b").value = valorB[2].replace(",", ".");
    if (valorC) document.getElementById("c").value = valorC[2].replace(",", ".");

    alert("Coeficientes preenchidos pela voz.");
};

reconhecimento.onerror = function(e) {
    alert("Erro ao usar a entrada por voz: " + e.error);
};

/* =======================
   QR Code
======================= */
function gerarQRCode() {
    const url = window.location.href;
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    document.getElementById("qrImg").src = api;
}

gerarQRCode();
