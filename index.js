class Credito {
    constructor(monto, interes, plazo) {
        this.monto = monto;
        this.interes = interes;
        this.plazo = plazo;
        this.amortizacion = [];
    }

    calcularCredito() {
        const n = this.plazo;
        const tasaMensual = this.interes / 100 / 12;
        const cuotaMensual = (this.monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));
        const totalPagar = cuotaMensual * n;

        let saldoRestante = this.monto;
        for (let i = 0; i < n; i++) {
            let interesMensual = saldoRestante * tasaMensual;
            let capitalMensual = cuotaMensual - interesMensual;
            saldoRestante -= capitalMensual;
            this.amortizacion.push(new Amortizacion(i + 1, cuotaMensual, capitalMensual, interesMensual, saldoRestante));
        }

        return {
            cuotaMensual: cuotaMensual.toFixed(2),
            totalPagar: totalPagar.toFixed(2),
            amortizacion: this.amortizacion
        };
    }
}


class Amortizacion {
    constructor(mes, cuota, capital, interes, saldo) {
        this.mes = mes;
        this.cuota = cuota.toFixed(2);
        this.capital = capital.toFixed(2);
        this.interes = interes.toFixed(2);
        this.saldo = saldo.toFixed(2);
    }
}


function capturarEntradas() {
    const monto = parseFloat(document.getElementById('monto').value);
    const interes = parseFloat(document.getElementById('interes').value);
    const plazo = parseInt(document.getElementById('plazo').value);

    if (isNaN(monto) || isNaN(interes) || isNaN(plazo) || monto <= 0 || interes <= 0 || plazo <= 0) {
        alert('Por favor, ingrese valores válidos.');
        return null;
    }

    return new Credito(monto, interes, plazo);
}

function mostrarResultado(resultado) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <p>Cuota Mensual: $${resultado.cuotaMensual}</p>
        <p>Total a Pagar: $${resultado.totalPagar}</p>
        <h3>Amortización:</h3>
        <table>
            <tr>
                <th>Mes</th>
                <th>Cuota</th>
                <th>Capital</th>
                <th>Interés</th>
                <th>Saldo</th>
            </tr>
            ${resultado.amortizacion.map(amort => `
                <tr>
                    <td>${amort.mes}</td>
                    <td>${amort.cuota}</td>
                    <td>${amort.capital}</td>
                    <td>${amort.interes}</td>
                    <td>${amort.saldo}</td>
                </tr>
            `).join('')}
        </table>
    `;
}


function guardarDatos(credito) {
    const datos = JSON.stringify(credito);
    localStorage.setItem('credito', datos);
    alert('Datos guardados correctamente');
}


function recuperarDatos() {
    const datos = localStorage.getItem('credito');
    if (datos) {
        const creditoObj = JSON.parse(datos);
        const credito = new Credito(creditoObj.monto, creditoObj.interes, creditoObj.plazo);
        credito.amortizacion = creditoObj.amortizacion;
        const resultado = credito.calcularCredito();
        mostrarResultado(resultado);
    } else {
        alert('No hay datos guardados');
    }
}


document.getElementById('calcular').addEventListener('click', () => {
    const credito = capturarEntradas();
    if (credito) {
        const resultado = credito.calcularCredito();
        mostrarResultado(resultado);
    }
});

document.getElementById('guardar').addEventListener('click', () => {
    const credito = capturarEntradas();
    if (credito) {
        guardarDatos(credito);
    }
});

document.getElementById('recuperar').addEventListener('click', recuperarDatos);

