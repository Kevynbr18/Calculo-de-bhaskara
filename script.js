let grafico = null;
const historico = [];

document.getElementById("temaBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

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

    grafico = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Parábola",
                    data: pontos,
                    showLine: true,
                    borderWidth: 2,
                },
                {
                    label: "Raízes",
                    data: marcadores,
                    pointRadius: 6,
                    borderColor: "red",
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
}
