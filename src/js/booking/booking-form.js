import { isClickOutside, toCamelCase } from '../helpers';
import { setTicketsFormValues, formInputsToValues, seniorDiscount, prices } from '../tickets-form';

const ticketTypeFullNames = {
  'permanent': 'Permanent exhibition',
  'temporary': 'Temporary exhibition',
  'combined': 'Combined Admission',
}
const bookingForm = document.querySelector('.booking-form');
function selectBookingInput(name) {
  return bookingForm.querySelector(`[name="booking-${name}"]`);
}

const formInputNames = ['date', 'time', 'name', 'email', 'phone', 'basic', 'senior', 'ticket-type'];
const formInputs = formInputNames.reduce((form, name) => {
  form[toCamelCase(name)] = selectBookingInput(name);
  return form;
}, {});

const ticketTypeSelectOptions = bookingForm.querySelector('.booking-form__ticket-type-select-options');

const bookingOverviewFields = [...bookingForm.querySelectorAll('[data-overview]')].reduce((hash, el) => {
  hash[toCamelCase(el.dataset.overview)] = el;
  return hash;
}, {});

function handleInput(e) {
  const types = ['date', 'time', 'select-one'];
  const value = e.target.localName === 'input'
    ? e.target.value
    : ticketTypeFullNames[e.target.value];

  if (types.includes(e.target.type)) {
    const textInput = e.target.parentNode.querySelector('input[type="text"]');
    textInput.value = value;
  }

  const names = ['booking-ticket-type', 'booking-senior', 'booking-basic'];
  if (names.includes(e.target.name)) {
    const { ticketType, basic, senior } = formInputsToValues(formInputs);
    setTicketsFormValues({ ticketType, basic, senior });  
  }
  
  updateOverview();
}

function calculateTotal(price, basicNumber, seniorNumber) {
  return price * basicNumber + price * seniorDiscount * seniorNumber;
}

function renderNotChoosen(message) {
  return `<span class="booking-form__overview-not-choosen">${message}</span>`;
}

function updateOverview() {
  const { basic, senior, date, time, ticketType } = formInputsToValues(formInputs);
  const price = prices[ticketType];

  bookingOverviewFields.date.innerHTML = formatDate(date) || renderNotChoosen('Choose date');
  bookingOverviewFields.time.innerHTML = time || renderNotChoosen('Choose time');
  bookingOverviewFields.ticketType.textContent = ticketTypeFullNames[ticketType];
  bookingOverviewFields.basicCount.textContent = basic;
  bookingOverviewFields.basicPrice.textContent = price;
  bookingOverviewFields.bookingFormBasicPrice.textContent = price;
  bookingOverviewFields.basicAmount.textContent = basic * price;
  bookingOverviewFields.seniorCount.textContent = senior;
  bookingOverviewFields.seniorPrice.textContent = price * seniorDiscount;
  bookingOverviewFields.bookingFormSeniorPrice.textContent = price * seniorDiscount;
  bookingOverviewFields.seniorAmount.textContent = senior * price * seniorDiscount;
  bookingOverviewFields.total.textContent = calculateTotal(price, basic, senior);
}

function formatDate(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString); 
  const [day, weekDay, mounth] = [date.getDate(), date.getDay(), date.getMonth()];
  const mounths = ['January', 'Februar', 'March', 'April', 'May', 'June', 'July', 'August'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return `${weekDays[weekDay]}, ${mounths[mounth]} ${day}`;
}

function setDateMinAttribute() {
  const today = new Date();
  const [ dd, mm, yyyy ] = [ today.getDate(), today.getMonth() + 1, today.getFullYear() ];
  const withZero = n => n < 10 ? '0' + n : n;
  formInputs.date.min = `${yyyy}-${withZero(mm)}-${withZero(dd)}`;
}

function setTicketTypeValue(value) {
  formInputs.ticketType.value = value;
  formInputs.ticketType.dispatchEvent(new Event('input'));

  renderTicketTypeOptions(value);
}

function renderTicketTypeOptions(value) {
  const options = ticketTypeSelectOptions.querySelectorAll('li');
  for(const option of options) {
    option.classList.remove('active');
    if (option.dataset.value === value) {
      option.classList.add('active');
    }
  }
}

function handleNumberChange(e, btn) {
  const { action } = btn.dataset;
  const numberInput = action === 'inc' ? btn.previousElementSibling : btn.nextElementSibling;
  const method = action === 'inc' ? 'stepUp' : 'stepDown';
  numberInput[method]();
  numberInput.dispatchEvent(new Event('input'));
}

function handleFormSubmit(e) {
  e.preventDefault();

  setTimeout(() => {
    alert('Form was successfully sent to the server (actually, it wasn`t)');
  }, 1000);
}

function handleBookingFormClick(e) {
  const numberBtn = e.target.closest('.booking-form__number-btn');
  if (numberBtn) {
    handleNumberChange(e, numberBtn);
  }
}

function handleDocumentClick(e) {
  if (isClickOutside(e, [
    'booking-form__ticket-type-select-options', 
    'booking-form__ticket-type-select'
  ])) {
    ticketTypeSelectOptions.classList.remove('booking-form__ticket-type-select-options_show');
  }
}

export function setBookingFormValues(data) {
  const { ticketType, basic, senior } = data;
  formInputs.basic.value = basic;
  formInputs.senior.value = senior;

  formInputs.ticketType.value = ticketType;
  const textInput = formInputs.ticketType.parentNode.querySelector('input[type="text"]');
  textInput.value = ticketTypeFullNames[ticketType];
  renderTicketTypeOptions(ticketType);
  updateOverview();
}

export function init() {
  bookingForm.addEventListener('click', handleBookingFormClick);
  bookingForm.addEventListener('submit', handleFormSubmit);

  Object.keys(formInputs).forEach(key => formInputs[key].addEventListener('input', handleInput));
  
  formInputs.ticketType.addEventListener('mousedown', e => e.preventDefault());
  formInputs.ticketType.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.toggle('booking-form__ticket-type-select-options_show');
  });
  
  ticketTypeSelectOptions.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.remove('booking-form__ticket-type-select-options_show');
    setTicketTypeValue(e.target.dataset.value);
  });
  
  
  // document.querySelector('.tickets-form').addEventListener('formUpdate', setValuesFromTicketsForm)
  document.addEventListener('click', handleDocumentClick);

  setDateMinAttribute();
}