let grafico = null;
let ultimo = null;
const historico = [];

/* ============================
   Alternar Tema
============================ */
document.getElementById("temaBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (ultimo) gerarGrafico(ultimo);
});

/* ============================
   CÁLCULO DE BHASKARA
============================ */
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
        x1 = `${(-b / (2 * a)).toFixed(3)} + ${(Math.sqrt(-delta) / (2 * a)).toFixed(3)}i`;
        x2 = `${(-b / (2 * a)).toFixed(3)} - ${(Math.sqrt(-delta) / (2 * a)).toFixed(3)}i`;

        explicacao.textContent =
            "Delta negativo. As raízes são complexas e não aparecem como interceptações reais.";
    } else {
        x1 = ((-b + Math.sqrt(delta)) / (2 * a)).toFixed(3);
        x2 = ((-b - Math.sqrt(delta)) / (2 * a)).toFixed(3);
    }

    preencherTabela(delta, x1, x2);
    adicionarAoHistorico(a, b, c, x1, x2);

    ultimo = { a, b, c, delta, x1, x2 };
    gerarGrafico(ultimo);
}

/* ============================
   TABELA
============================ */
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

/* ============================
   HISTÓRICO – MOSTRA APENAS 2
============================ */
function adicionarAoHistorico(a, b, c, x1, x2) {
    historico.push({ a, b, c, x1, x2 });

    const lista = document.getElementById("historicoLista");
    lista.innerHTML = "";

    // MOSTRAR SOMENTE OS 2 ÚLTIMOS
    let ultimos = historico.slice(-2);

    ultimos.forEach(item => {
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

/* ============================
   POPUP DO HISTÓRICO COMPLETO
============================ */
const popup = document.getElementById("popupHistorico");
const popupLista = document.getElementById("popupLista");

/* Abre o popup */
document.getElementById("verMaisBtn").addEventListener("click", () => {
    preencherPopup();
    popup.style.display = "flex";
});

/* Fecha o popup */
document.getElementById("fecharPopup").addEventListener("click", () => {
    popup.style.display = "none";
});

/* Preenche o popup com TODO o histórico */
function preencherPopup() {
    popupLista.innerHTML = "";

    historico.forEach((item, index) => {
        popupLista.innerHTML += `
            <tr>
                <td>${item.a}</td>
                <td>${item.b}</td>
                <td>${item.c}</td>
                <td>${item.x1}</td>
                <td>${item.x2}</td>
                <td>
                    <button onclick="excluirItem(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

/* Excluir item específico */
function excluirItem(i) {
    historico.splice(i, 1);
    preencherPopup();
    adicionarAoHistorico();
}

/* Excluir tudo */
document.getElementById("limparTudoBtn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
        historico.length = 0;
        popupLista.innerHTML = "";
        adicionarAoHistorico();
    }
});


/* ============================
   GRÁFICO
============================ */
function gerarGrafico({ a, b, c }) {
    const escuro = document.body.classList.contains("dark");
    const corTexto = escuro ? "#fff" : "#000";
    const corGrade = escuro ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
    const corFuncao = escuro ? "#3ea0ff" : "#004dff";

    const pontos = [];
    const inicio = -10;
    const fim = 10;

    for (let x = inicio; x <= fim; x += 0.2) {
        pontos.push({ x, y: a * x * x + b * x + c });
    }

    // VÉRTICE
    const xv = -b / (2 * a);
    const yv = a * xv * xv + b * xv + c;

    if (grafico) grafico.destroy();

    grafico = new Chart(document.getElementById("grafico"), {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Parábola",
                    data: pontos,
                    borderColor: corFuncao,
                    backgroundColor: "transparent",
                    showLine: true,
                    borderWidth: 2
                },
                {
                    label: "Vértice",
                    data: [{ x: xv, y: yv }],
                    backgroundColor: "#ff4444",
                    pointRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "linear",
                    ticks: { color: corTexto },
                    grid: { color: corGrade }
                },
                y: {
                    ticks: { color: corTexto },
                    grid: { color: corGrade },

                    // GARANTIR ZERO SEMPRE VISÍVEL
                    min: Math.min(0, ...pontos.map(p => p.y)) - 1,
                    max: Math.max(0, ...pontos.map(p => p.y)) + 1
                }
            }
        }
    });
}

/* ============================
   Entrada por Voz
============================ */
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const reconhecimento = new SpeechRecognition();
reconhecimento.lang = "pt-BR";

document.getElementById("vozBtn").addEventListener("click", () => reconhecimento.start());

reconhecimento.onresult = function(event) {
    const frase = event.results[0][0].transcript.toLowerCase();

    const A = frase.match(/a\s*(igual\s*a)?\s*(-?\d+)/);
    const B = frase.match(/b\s*(igual\s*a)?\s*(-?\d+)/);
    const C = frase.match(/c\s*(igual\s*a)?\s*(-?\d+)/);

    if (A) document.getElementById("a").value = A[2];
    if (B) document.getElementById("b").value = B[2];
    if (C) document.getElementById("c").value = C[2];

    alert("Coeficientes definidos pela voz.");
};

/* ============================
   QR CODE
============================ */
function gerarQRCode() {
    const url = window.location.href;
    const endpoint =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    document.getElementById("qrImg").src = endpoint;
}
gerarQRCode();
