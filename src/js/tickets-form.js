import { toCamelCase } from './helpers';
import { setBookingFormValues } from './booking/booking-form';

const form = document.querySelector('.tickets-form');
const totalField = document.querySelector('.tickets-form__total');
const booking = document.querySelector('.booking');

export const seniorDiscount = 0.5;
export const prices = {
  'permanent': 20,
  'temporary': 25,
  'combined': 40,
}

const formInputNames = ['basic', 'senior', 'ticket-type'];
const formInputs = formInputNames.reduce((hash, name) => {
  const nodes = form.querySelectorAll(`[name="${name}"]`);
  hash[toCamelCase(name)] = nodes.length === 1 ? nodes[0] : nodes;
  return hash;
}, {});

function handleFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  booking.classList.add('booking_show');
}

function handleNumberChange(e, btn) {
  const { action } = btn.dataset;
  const numberInput = action === 'inc' ? btn.previousElementSibling : btn.nextElementSibling;
  const method = action === 'inc' ? 'stepUp' : 'stepDown';
  numberInput[method]();
}

function renderTotal(total) {
  totalField.innerHTML = `Total &euro;${total}`;
}

export function formInputsToValues(formInputs) {
  return Object.keys(formInputs)
    .reduce((hash, inputName) => {
      let el = formInputs[inputName];
      let value = el.value;
      if (el instanceof NodeList
          && el[0].type === 'radio') {
        value = [...el].find(item => item.checked).value;
      }
      hash[inputName] = value;
      return hash;
    }, {});
}

function calculateTotal(data) {
  const { ticketType, basic, senior } = data;
  const price = prices[ticketType];
  const total = price * basic + price * seniorDiscount * senior;

  return total;
}

function handleFormClick(e) {
  const handlers = {
    'radio': () => {},
    'submit': handleFormSubmit,
    'number-btn': handleNumberChange
  }
  Object.keys(handlers).forEach(key => {
    const el = e.target.closest(`.tickets-form__${key}`);
    if (el) {
      handlers[key].call(null, e, el);
      const data = formInputsToValues(formInputs);
      saveToLocalStorage(data);
      setBookingFormValues(data);
      renderTotal(calculateTotal(data));
    }
  });
}

function updateForm(data) {
  renderTotal(calculateTotal(data));
  setFormValues(data);
}

function setFormValues({ ticketType, basic, senior }) {
  for (const input of formInputs.ticketType) {
    input.checked = input.value === ticketType;
  }
  formInputs.basic.value = basic;
  formInputs.senior.value = senior;
}

function saveToLocalStorage(data) {
  localStorage.setItem('formData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const ticketsFormData = localStorage.getItem('formData');
  if (ticketsFormData) {
    const data = JSON.parse(ticketsFormData);
    updateForm(data);
  }
}

export function setTicketsFormValues(data) {
  updateForm(data)
}

export function init() {
  form.addEventListener('click', handleFormClick);

  loadFromLocalStorage();
}