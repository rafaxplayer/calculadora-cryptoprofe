document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENTOS DEL DOM ---
    // Seleccionamos todos los campos de entrada y los elementos donde mostraremos los resultados.
    const balanceInput = document.getElementById('balance');
    const riskInput = document.getElementById('risk');
    const entryPriceInput = document.getElementById('entryPrice');
    const stopLossInput = document.getElementById('stopLoss');
    const leverageInput = document.getElementById('leverage');

    const riskCapitalValueEl = document.getElementById('riskCapitalValue');
    const positionSizeCryptoEl = document.getElementById('positionSizeCrypto');
    const positionSizeUSDEl = document.getElementById('positionSizeUSD');
    const marginRequiredEl = document.getElementById('marginRequired');
    const marginRequiredLa = document.getElementById('marginRequiredLabel');
    const errorMessageEl = document.getElementById('error-message');

    // --- LISTA DE INPUTS ---
    // Agrupamos todos los inputs para añadirles un listener fácilmente.
    const inputs = [balanceInput, riskInput, entryPriceInput, stopLossInput, leverageInput];

    // --- FUNCIÓN PRINCIPAL DE CÁLCULO ---
    function calculatePosition() {
        // 1. OBTENER Y CONVERTIR VALORES DE ENTRADA
        // Obtenemos los valores de los campos y los convertimos a números de punto flotante.
        const balance = parseFloat(balanceInput.value);
        const riskPercent = parseFloat(riskInput.value);
        const entryPrice = parseFloat(entryPriceInput.value);
        const stopLoss = parseFloat(stopLossInput.value);
        const leverage = parseFloat(leverageInput.value);

        // Limpiar mensaje de error previo
        errorMessageEl.textContent = '';

        // 2. VALIDACIÓN DE ENTRADAS
        // Verificamos que todos los campos tengan valores numéricos y válidos.
        if (isNaN(balance) || isNaN(riskPercent) || isNaN(entryPrice) || isNaN(stopLoss) || isNaN(leverage)) {
            // Si falta algún dato, no hacemos nada. El usuario aún está escribiendo.
            return;
        }

        if (balance <= 0 || riskPercent <= 0 || entryPrice <= 0 || stopLoss <= 0 || leverage <= 0) {
            errorMessageEl.textContent = 'Todos los valores deben ser positivos.';
            return;
        }

        if (entryPrice <= stopLoss) {
            errorMessageEl.textContent = 'El precio de entrada debe ser mayor al Stop Loss para un LONG.';
            // También podrías manejar la lógica para un SHORT aquí si quisieras.
            // Por ahora, asumimos que es una posición en largo (LONG).
            return;
        }

        // 3. REALIZAR CÁLCULOS
        // Las fórmulas son una réplica directa de la lógica de la hoja de cálculo.

        // Capital a arriesgar = Balance * (Riesgo / 100)
        const riskCapital = balance * (riskPercent / 100);

        // Diferencia de precio para el cálculo del stop
        const priceDifference = entryPrice - stopLoss;

        // Tamaño de la posición en la criptomoneda = Capital a arriesgar / (Precio de Entrada - Stop Loss)
        const positionSizeCrypto = riskCapital / priceDifference;

        // Tamaño de la posición en USD = Tamaño en Crypto * Precio de Entrada
        const positionSizeUSD = positionSizeCrypto * entryPrice;

        // Margen requerido = Tamaño de la posición en USD / Apalancamiento
        const marginRequired = positionSizeUSD / leverage;

        // 4. MOSTRAR RESULTADOS EN LA UI
        // Formateamos los resultados para que se vean bien y los mostramos en la interfaz.
        riskCapitalValueEl.textContent = `$${riskCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        positionSizeCryptoEl.textContent = positionSizeCrypto.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
        positionSizeUSDEl.textContent = `$${positionSizeUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        marginRequiredEl.textContent = `$${marginRequired.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        marginRequiredLa.textContent = `Margen Requerido x${leverage}`;
    }

    // --- EVENT LISTENERS ---
    // Añadimos un listener a cada campo de entrada.
    // El evento 'input' se dispara cada vez que el usuario escribe,
    // lo que permite que la calculadora se actualice en tiempo real.
    inputs.forEach(input => {
        input.addEventListener('input', calculatePosition);
    });

    // --- CÁLCULO INICIAL ---
    // Realizamos un cálculo inicial al cargar la extensión con los valores por defecto.
    calculatePosition();
});

document.getElementById('max').addEventListener('click', function () {
  // Obtiene la URL absoluta de popup.html dentro de la extensión
  const url = chrome.runtime.getURL('popup.html');
  chrome.tabs.create({ url });
});
