const form = document.querySelector('.tickets-form');
const totalField = document.querySelector('.tickets-form__total');
const booking = document.querySelector('.booking');

const seniorDiscount = 0.5;
const prices = {
  'permanent': 20,
  'temporary': 25,
  'combined': 40,
}

let currentTicketType = 'permanent';
let ticketsNumber = {
  'basic': 1,
  'senior': 1
}

function handleFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  booking.classList.add('booking_show');
}

function handleRadioClick(e, radio) {
  currentTicketType = radio.value;
}

function handleNumberChange(e, btn) {
  const { action } = btn.dataset;
  const numberInput = action === 'inc' ? btn.previousElementSibling : btn.nextElementSibling;
  const method = action === 'inc' ? 'stepUp' : 'stepDown';
  numberInput[method]();
  ticketsNumber[numberInput.name] = +numberInput.value;
}


function renderTotal(total = calculateTotal()) {
  totalField.innerHTML = `Total &euro;${total}`;
}

function calculateTotal() {
  const price = prices[currentTicketType];
  const total = price * ticketsNumber.basic + price * seniorDiscount * ticketsNumber.senior;

  return total;
}

function handleFormClick(e) {
  const handlers = {
    'radio': handleRadioClick,
    'submit': handleFormSubmit,
    'number-btn': handleNumberChange
  }
  Object.keys(handlers).forEach(key => {
    const el = e.target.closest(`.tickets-form__${key}`);
    if (el) {
      handlers[key].call(null, e, el);
      saveToLocalStorage();
      updateForm();
    }
  });
}

function updateForm() {
  setFormValues();
  renderTotal();
  const event = new Event('formUpdate');
  event.formData = { currentTicketType, ticketsNumber };
  form.dispatchEvent(event);
}

function setFormValues() {
  const ticketTypeInputs = form.querySelectorAll('input[name="ticket-type"]');
  const basicNamberInput = form.querySelector('input[name="basic"]');
  const seniorNamberInput = form.querySelector('input[name="senior"]');

  for(const input of ticketTypeInputs) {
    input.checked = input.value === currentTicketType;
  }
  basicNamberInput.value = ticketsNumber.basic;
  seniorNamberInput.value = ticketsNumber.senior;
}

function saveToLocalStorage() {
  localStorage.setItem('ticketsFormData', JSON.stringify({currentTicketType, ticketsNumber}));
}

function loadFromLocalStorage() {
  const ticketsFormData = localStorage.getItem('ticketsFormData');
  if (ticketsFormData) {
    const data = JSON.parse(ticketsFormData);
    currentTicketType = data.currentTicketType;
    ticketsNumber = data.ticketsNumber;
  }
}

export default function init() {
  form.addEventListener('click', handleFormClick);

  loadFromLocalStorage();
  updateForm();
}