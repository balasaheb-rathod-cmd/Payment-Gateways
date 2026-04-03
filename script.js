// ===== Dark Mode =====
const darkToggle = document.getElementById('darkToggle');
const body = document.body;

darkToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const icon = darkToggle.querySelector('i');
  icon.className = body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
});

// ===== Tab Switching =====
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tabContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ===== Card Preview Live Update =====
const cardNumberInput = document.getElementById('cardNumber');
const cardHolderInput = document.getElementById('cardHolder');
const expiryInput     = document.getElementById('expiry');

const cardNumberPreview = document.getElementById('cardNumberPreview');
const cardHolderPreview = document.getElementById('cardHolderPreview');
const cardExpiryPreview = document.getElementById('cardExpiryPreview');
const cardNetwork       = document.getElementById('cardNetwork');

// Format card number with spaces every 4 digits
cardNumberInput.addEventListener('input', () => {
  let val = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
  cardNumberInput.value = val.replace(/(.{4})/g, '$1 ').trim();

  const display = val.padEnd(16, '•');
  cardNumberPreview.textContent =
    display.slice(0,4) + ' ' + display.slice(4,8) + ' ' + display.slice(8,12) + ' ' + display.slice(12,16);

  // Detect card network
  if      (/^4/.test(val))          cardNetwork.textContent = 'VISA';
  else if (/^5[1-5]/.test(val))     cardNetwork.textContent = 'MASTERCARD';
  else if (/^3[47]/.test(val))      cardNetwork.textContent = 'AMEX';
  else if (/^6/.test(val))          cardNetwork.textContent = 'RUPAY';
  else                              cardNetwork.textContent = '';
});

cardHolderInput.addEventListener('input', () => {
  cardHolderPreview.textContent = cardHolderInput.value.toUpperCase() || 'YOUR NAME';
});

expiryInput.addEventListener('input', () => {
  let val = expiryInput.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 3) val = val.slice(0,2) + '/' + val.slice(2);
  expiryInput.value = val;
  cardExpiryPreview.textContent = expiryInput.value || 'MM/YY';
});

// ===== Validation Helpers =====
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  if (msg) el.previousElementSibling?.querySelector('input')?.classList.add('invalid');
}

function clearError(id) {
  const el = document.getElementById(id);
  el.textContent = '';
}

function setInputState(input, valid) {
  input.classList.toggle('valid',   valid);
  input.classList.toggle('invalid', !valid);
}

function validateCardNumber(val) {
  const digits = val.replace(/\s/g, '');
  return /^\d{16}$/.test(digits);
}

function validateExpiry(val) {
  if (!/^\d{2}\/\d{2}$/.test(val)) return false;
  const [mm, yy] = val.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const expDate = new Date(2000 + yy, mm - 1, 1);
  return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function validateCVV(val) { return /^\d{3}$/.test(val); }
function validateName(val) { return val.trim().length >= 2; }
function validateUPI(val)  { return /^[\w.\-]+@[\w]+$/.test(val.trim()); }

// ===== Inline validation on blur =====
cardNumberInput.addEventListener('blur', () => {
  const ok = validateCardNumber(cardNumberInput.value);
  setInputState(cardNumberInput, ok);
  document.getElementById('cardNumberError').textContent = ok ? '' : 'Enter a valid 16-digit card number.';
});

cardHolderInput.addEventListener('blur', () => {
  const ok = validateName(cardHolderInput.value);
  setInputState(cardHolderInput, ok);
  document.getElementById('cardHolderError').textContent = ok ? '' : 'Enter the cardholder name.';
});

expiryInput.addEventListener('blur', () => {
  const ok = validateExpiry(expiryInput.value);
  setInputState(expiryInput, ok);
  document.getElementById('expiryError').textContent = ok ? '' : 'Enter a valid future date (MM/YY).';
});

document.getElementById('cvv').addEventListener('blur', () => {
  const ok = validateCVV(document.getElementById('cvv').value);
  setInputState(document.getElementById('cvv'), ok);
  document.getElementById('cvvError').textContent = ok ? '' : 'CVV must be 3 digits.';
});

document.getElementById('upiId').addEventListener('blur', () => {
  const ok = validateUPI(document.getElementById('upiId').value);
  setInputState(document.getElementById('upiId'), ok);
  document.getElementById('upiError').textContent = ok ? '' : 'Enter a valid UPI ID (e.g. name@upi).';
});

// ===== Bank Chip Selection =====
document.querySelectorAll('.bank-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.bank-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    document.getElementById('bankSelect').value = chip.dataset.bank;
  });
});

document.getElementById('bankSelect').addEventListener('change', () => {
  const val = document.getElementById('bankSelect').value;
  document.querySelectorAll('.bank-chip').forEach(c => {
    c.classList.toggle('selected', c.dataset.bank === val);
  });
});

// ===== Payment Processing =====
const loadingOverlay = document.getElementById('loadingOverlay');
const resultScreen   = document.getElementById('resultScreen');
const resultIcon     = document.getElementById('resultIcon');
const resultTitle    = document.getElementById('resultTitle');
const resultMsg      = document.getElementById('resultMsg');
const retryBtn       = document.getElementById('retryBtn');

function processPayment() {
  loadingOverlay.classList.add('show');

  const delay = 2000 + Math.random() * 1000; // 2–3 seconds

  setTimeout(() => {
    loadingOverlay.classList.remove('show');

    // 80% success rate simulation
    const success = Math.random() < 0.8;
    showResult(success);
  }, delay);
}

function showResult(success) {
  resultScreen.classList.add('show');

  if (success) {
    resultIcon.className = 'result-icon success';
    resultIcon.innerHTML = `
      <svg class="checkmark-svg" viewBox="0 0 52 52" aria-hidden="true">
        <circle class="checkmark-circle" cx="26" cy="26" r="24"/>
        <path class="checkmark-check" d="M14 27 l8 8 l16-16"/>
      </svg>`;
    resultTitle.textContent = 'Payment Successful';
    resultTitle.style.color = 'var(--success)';
    resultMsg.textContent = 'Your payment of ₹5,898 was processed successfully. A confirmation has been sent to your email.';
  } else {
    resultIcon.className = 'result-icon fail';
    resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    resultTitle.textContent = 'Payment Failed';
    resultTitle.style.color = 'var(--error)';
    resultMsg.textContent = 'We could not process your payment. Please check your details and try again.';
  }
}

retryBtn.addEventListener('click', () => {
  resultScreen.classList.remove('show');
  // Reset forms
  document.getElementById('cardForm').reset();
  document.getElementById('upiForm').reset();
  document.getElementById('netbankingForm').reset();
  // Reset card preview
  cardNumberPreview.textContent = '•••• •••• •••• ••••';
  cardHolderPreview.textContent = 'YOUR NAME';
  cardExpiryPreview.textContent = 'MM/YY';
  cardNetwork.textContent = '';
  // Clear validation states
  document.querySelectorAll('input').forEach(i => i.classList.remove('valid', 'invalid'));
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
  document.querySelectorAll('.bank-chip').forEach(c => c.classList.remove('selected'));
});

// ===== Form Submissions =====
document.getElementById('cardForm').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  if (!validateCardNumber(cardNumberInput.value)) {
    document.getElementById('cardNumberError').textContent = 'Enter a valid 16-digit card number.';
    setInputState(cardNumberInput, false);
    valid = false;
  }
  if (!validateName(cardHolderInput.value)) {
    document.getElementById('cardHolderError').textContent = 'Enter the cardholder name.';
    setInputState(cardHolderInput, false);
    valid = false;
  }
  if (!validateExpiry(expiryInput.value)) {
    document.getElementById('expiryError').textContent = 'Enter a valid future date (MM/YY).';
    setInputState(expiryInput, false);
    valid = false;
  }
  const cvvEl = document.getElementById('cvv');
  if (!validateCVV(cvvEl.value)) {
    document.getElementById('cvvError').textContent = 'CVV must be 3 digits.';
    setInputState(cvvEl, false);
    valid = false;
  }

  if (valid) processPayment();
});

document.getElementById('upiForm').addEventListener('submit', e => {
  e.preventDefault();
  const upiEl = document.getElementById('upiId');
  if (!validateUPI(upiEl.value)) {
    document.getElementById('upiError').textContent = 'Enter a valid UPI ID (e.g. name@upi).';
    setInputState(upiEl, false);
    return;
  }
  processPayment();
});

document.getElementById('netbankingForm').addEventListener('submit', e => {
  e.preventDefault();
  const bankEl = document.getElementById('bankSelect');
  if (!bankEl.value) {
    document.getElementById('bankError').textContent = 'Please select a bank.';
    return;
  }
  document.getElementById('bankError').textContent = '';
  processPayment();
});
