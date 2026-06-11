const resultEl    = document.getElementById('result');
  const expressionEl = document.getElementById('expression');

  let currentInput  = '0';
  let previousInput = '';
  let operator      = null;
  let shouldReset   = false;
  let expression    = '';

  function updateDisplay() {
    resultEl.textContent = currentInput;
    expressionEl.textContent = expression;
    const len = currentInput.length;
    resultEl.className = 'result';
    if (len > 12) resultEl.classList.add('small');
  }

  function inputNumber(val) {
    if (shouldReset) { currentInput = val; shouldReset = false; }
    else if (currentInput === '0' && val !== '.') currentInput = val;
    else if (currentInput.length < 15) currentInput += val;
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldReset) { currentInput = '0.'; shouldReset = false; }
    else if (!currentInput.includes('.')) currentInput += '.';
    updateDisplay();
  }

  function inputOperator(op) {
    if (operator && !shouldReset) calculate(false);
    previousInput = currentInput;
    operator = op;
    shouldReset = true;
    expression = previousInput + ' ' + op;
    updateDisplay();
  }

  function calculate(final = true) {
    if (!operator || !previousInput) return;
    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    let res;
    switch (operator) {
      case '+': res = a + b; break;
      case '−': res = a - b; break;
      case '×': res = a * b; break;
      case '÷':
        if (b === 0) { showError('Cannot divide by 0'); return; }
        res = a / b; break;
    }
    if (final) expression = previousInput + ' ' + operator + ' ' + currentInput + ' =';
    // Round floating point
    res = parseFloat(res.toPrecision(12));
    currentInput = String(res);
    if (final) { operator = null; previousInput = ''; shouldReset = true; }
    updateDisplay();
  }

  function showError(msg) {
    resultEl.textContent = msg;
    resultEl.className = 'result error';
    expression = '';
    currentInput = '0'; previousInput = ''; operator = null; shouldReset = true;
  }

  function clearAll() {
    currentInput = '0'; previousInput = ''; operator = null;
    shouldReset = false; expression = '';
    updateDisplay();
  }

  function toggleSign() {
    if (currentInput === '0') return;
    currentInput = currentInput.startsWith('-')
      ? currentInput.slice(1)
      : '-' + currentInput;
    updateDisplay();
  }

  function percent() {
    currentInput = String(parseFloat(currentInput) / 100);
    updateDisplay();
  }

  // Button click handler
  document.querySelector('.buttons').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    addRipple(btn, e);
    const action = btn.dataset.action;
    const value  = btn.dataset.value;
    if (action === 'number')   inputNumber(value);
    if (action === 'decimal')  inputDecimal();
    if (action === 'operator') inputOperator(value);
    if (action === 'equals')   calculate(true);
    if (action === 'clear')    clearAll();
    if (action === 'sign')     toggleSign();
    if (action === 'percent')  percent();
  });

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('+');
    else if (e.key === '-') inputOperator('−');
    else if (e.key === '*') inputOperator('×');
    else if (e.key === '/') { e.preventDefault(); inputOperator('÷'); }
    else if (e.key === '%') percent();
    else if (e.key === 'Enter' || e.key === '=') calculate(true);
    else if (e.key === 'Backspace') {
      if (currentInput.length > 1) currentInput = currentInput.slice(0,-1);
      else currentInput = '0';
      updateDisplay();
    }
    else if (e.key === 'Escape') clearAll();
  });

  // Ripple
  function addRipple(btn, e) {
    const r = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.className = 'ripple';
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 400);
  }