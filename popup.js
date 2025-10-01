document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENTOS DEL DOM ---
    const balanceInput = document.getElementById('balance');
    const riskInput = document.getElementById('risk');
    const entryPriceInput = document.getElementById('entryPrice');
    const stopLossInput = document.getElementById('stopLoss');
    const leverageInput = document.getElementById('leverage');
    // --- NUEVO: Inputs para Take Profit ---
    const tp1Input = document.getElementById('tp1');
    const tp2Input = document.getElementById('tp2');
    const tp3Input = document.getElementById('tp3');

    const riskCapitalValueEl = document.getElementById('riskCapitalValue');
    const positionSizeCryptoEl = document.getElementById('positionSizeCrypto');
    const positionSizeUSDEl = document.getElementById('positionSizeUSD');
    const marginRequiredEl = document.getElementById('marginRequired');
    const marginRequiredLa = document.getElementById('marginRequiredLabel');
    // --- NUEVO: Elementos para mostrar beneficios ---
    const profitTP1El = document.getElementById('profitTP1');
    const profitTP2El = document.getElementById('profitTP2');
    const profitTP3El = document.getElementById('profitTP3');
    
    const errorMessageEl = document.getElementById('error-message');

    // --- LISTA DE INPUTS ---
    // --- MODIFICADO: Añadimos los nuevos inputs a la lista ---
    const inputs = [balanceInput, riskInput, entryPriceInput, stopLossInput, leverageInput, tp1Input, tp2Input, tp3Input];

    // --- FUNCIÓN PRINCIPAL DE CÁLCULO ---
    function calculatePosition() {
        // 1. OBTENER Y CONVERTIR VALORES DE ENTRADA
        const balance = parseFloat(balanceInput.value);
        const riskPercent = parseFloat(riskInput.value);
        const entryPrice = parseFloat(entryPriceInput.value);
        const stopLoss = parseFloat(stopLossInput.value);
        const leverage = parseFloat(leverageInput.value);
        // --- NUEVO: Obtener valores de TP (pueden ser NaN si están vacíos) ---
        const tp1 = parseFloat(tp1Input.value);
        const tp2 = parseFloat(tp2Input.value);
        const tp3 = parseFloat(tp3Input.value);

        // Limpiar mensaje de error y resultados de beneficios previos
        errorMessageEl.textContent = '';
        profitTP1El.textContent = '$0.00';
        profitTP2El.textContent = '$0.00';
        profitTP3El.textContent = '$0.00';

        // 2. VALIDACIÓN DE ENTRADAS
        // Verificamos que los campos principales tengan valores.
        if (isNaN(balance) || isNaN(riskPercent) || isNaN(entryPrice) || isNaN(stopLoss) || isNaN(leverage)) {
            return;
        }

        if (balance <= 0 || riskPercent <= 0 || entryPrice <= 0 || stopLoss <= 0 || leverage <= 0) {
            errorMessageEl.textContent = 'Los valores principales deben ser positivos.';
            return;
        }

        if (entryPrice <= stopLoss) {
            errorMessageEl.textContent = 'El precio de entrada debe ser mayor al Stop Loss para un LONG.';
            return;
        }
        
        // --- NUEVO: Validar que los TPs (si existen) sean mayores al precio de entrada ---
        if (!isNaN(tp1) && tp1 <= entryPrice) {
            errorMessageEl.textContent = 'El TP1 debe ser mayor que el precio de entrada.';
            return;
        }
        if (!isNaN(tp2) && tp2 <= entryPrice) {
            errorMessageEl.textContent = 'El TP2 debe ser mayor que el precio de entrada.';
            return;
        }
        if (!isNaN(tp3) && tp3 <= entryPrice) {
            errorMessageEl.textContent = 'El TP3 debe ser mayor que el precio de entrada.';
            return;
        }

        // 3. REALIZAR CÁLCULOS
        const riskCapital = balance * (riskPercent / 100);
        const priceDifference = entryPrice - stopLoss;
        const positionSizeCrypto = riskCapital / priceDifference;
        const positionSizeUSD = positionSizeCrypto * entryPrice;
        const marginRequired = positionSizeUSD / leverage;

        // --- NUEVO: Calcular beneficios para cada TP si el valor es válido ---
        const formatoDolares = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        
        if (!isNaN(tp1)) {
            const profit1 = (tp1 - entryPrice) * positionSizeCrypto;
            profitTP1El.textContent = `$${profit1.toLocaleString('en-US', formatoDolares)}`;
        }
        if (!isNaN(tp2)) {
            const profit2 = (tp2 - entryPrice) * positionSizeCrypto;
            profitTP2El.textContent = `$${profit2.toLocaleString('en-US', formatoDolares)}`;
        }
        if (!isNaN(tp3)) {
            const profit3 = (tp3 - entryPrice) * positionSizeCrypto;
            profitTP3El.textContent = `$${profit3.toLocaleString('en-US', formatoDolares)}`;
        }

        // 4. MOSTRAR RESULTADOS EN LA UI
        riskCapitalValueEl.textContent = `$${riskCapital.toLocaleString('en-US', formatoDolares)}`;
        positionSizeCryptoEl.textContent = positionSizeCrypto.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
        positionSizeUSDEl.textContent = `$${positionSizeUSD.toLocaleString('en-US', formatoDolares)}`;
        marginRequiredEl.textContent = `$${marginRequired.toLocaleString('en-US', formatoDolares)}`;
        marginRequiredLa.textContent = `Margen Requerido x${leverage}`;
    }

    // --- EVENT LISTENERS ---
    inputs.forEach(input => {
        input.addEventListener('input', calculatePosition);
    });

    // --- CÁLCULO INICIAL ---
    calculatePosition();
});

document.getElementById('max').addEventListener('click', function () {
  const url = chrome.runtime.getURL('popup.html');
  chrome.tabs.create({ url });
});