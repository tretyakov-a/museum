import { isClickOutside } from './helpers';

const seniorDiscount = 0.5;
const prices = {
  'permanent': 20,
  'temporary': 25,
  'combined': 40,
}
const ticketTypeFullNames = {
  'permanent': 'Permanent exhibition',
  'temporary': 'Temporary exhibition',
  'combined': 'Combined Admission',
}
const bookingForm = document.querySelector('.booking-form');
function selectBookingInput(name) {
  return bookingForm.querySelector(`[name="booking-${name}"]`);
}

const bookingDate = selectBookingInput('date');
const bookingTime = selectBookingInput('time');
const bookingName = selectBookingInput('name');
const bookingEmail = selectBookingInput('email');
const bookingPhone = selectBookingInput('phone');
const bookingBasic = selectBookingInput('basic');
const bookingSenior = selectBookingInput('senior');
const bookingTicketType = selectBookingInput('ticket-type');
const ticketTypeSelectOptions = bookingForm.querySelector('.booking-form__ticket-type-select-options');
const bookingInputs = [bookingDate, bookingTime, bookingName, bookingEmail, bookingPhone, bookingBasic, bookingSenior, bookingTicketType];

const bookingOverviewFields = [...bookingForm.querySelectorAll('[data-overview]')].reduce((hash, el) => {
  hash[toCamelCase(el.dataset.overview)] = el;
  return hash;
}, {});

const booking = document.querySelector('.booking');
const bookingCloseBtn = document.querySelector('.booking__close-btn');

function handleInput(e) {
  const types = ['date', 'time', 'select-one'];
  const value = e.target.localName === 'input'
    ? e.target.value
    : ticketTypeFullNames[e.target.value];

  if (types.includes(e.target.type)) {
    e.target.previousElementSibling.previousElementSibling.value = value;
  }

  updateOverview();
}

function calculateTotal(ticketType, basicNumber, seniorNumber) {
  const price = prices[ticketType];
  const total = price * basicNumber + price * seniorDiscount * seniorNumber;

  return total;
}

function toCamelCase(s) {
  return s.split('-')
    .map((word, i) => i !== 0 ? word[0]
    .toUpperCase() + word.slice(1) : word)
    .join('');
}

function updateOverview() {
  const {
    bookingBasic,
    bookingSenior,
    bookingDate,
    bookingTime,
    bookingTicketType
   } = bookingInputs
    .reduce((hash, input) => {
      hash[toCamelCase(input.name)] = input.value;
      return hash;
    }, {});
  
  const price = prices[bookingTicketType];

  bookingOverviewFields.date.textContent = formatDate(bookingDate);
  bookingOverviewFields.time.textContent = bookingTime;
  bookingOverviewFields.ticketType.textContent = ticketTypeFullNames[bookingTicketType];
  bookingOverviewFields.basicCount.textContent = bookingBasic;
  bookingOverviewFields.basicPrice.textContent = price;
  bookingOverviewFields.bookingFormBasicPrice.textContent = price;
  bookingOverviewFields.basicAmount.textContent = bookingBasic * price;
  bookingOverviewFields.seniorCount.textContent = bookingSenior;
  bookingOverviewFields.seniorPrice.textContent = price * seniorDiscount;
  bookingOverviewFields.bookingFormSeniorPrice.textContent = price * seniorDiscount;
  bookingOverviewFields.seniorAmount.textContent = bookingSenior * price * seniorDiscount;
  bookingOverviewFields.total.textContent = calculateTotal(bookingTicketType, bookingBasic, bookingSenior);
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

function hideBooking() {
  booking.classList.remove('booking_show');
  booking.classList.add('booking_hide');
  setTimeout(() => {
    booking.classList.remove('booking_hide');
  }, 400);
}

function setDateMinAttribute() {
  const today = new Date();
  const [ dd, mm, yyyy ] = [ today.getDate(), today.getMonth() + 1, today.getFullYear() ];
  const withZero = n => n < 10 ? '0' + n : n;
  bookingDate.min = `${yyyy}-${withZero(mm)}-${withZero(dd)}`;
}

function setValuesFromTicketsForm(e) {
  const { currentTicketType, ticketsNumber } = e.formData;

  setBookingTicketTypeSelectValue(currentTicketType);
  setBookingTicketsNumber(ticketsNumber);
}

function setBookingTicketsNumber(ticketsNumber) {
  bookingBasic.value = ticketsNumber.basic;
  bookingBasic.dispatchEvent(new Event('input'));
  bookingSenior.value = ticketsNumber.senior;
  bookingSenior.dispatchEvent(new Event('input'));
}

function setBookingTicketTypeSelectValue(value) {
  bookingTicketType.value = value;
  const options = ticketTypeSelectOptions.querySelectorAll('li');
  
  for(const option of options) {
    option.classList.remove('active');
    if (option.dataset.value === value) {
      option.classList.add('active');
    }
  }
  bookingTicketType.dispatchEvent(new Event('input'));
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

  console.log(e, 'FORM SUBMIT EVENT');
}

function handleBookingFormClick(e) {
  const numberBtn = e.target.closest('.booking-form__number-btn');
  if (numberBtn) {
    handleNumberChange(e, numberBtn);
  }
}

export default function init() {
  bookingForm.addEventListener('click', handleBookingFormClick);
  bookingForm.addEventListener('submit', handleFormSubmit);

  bookingInputs.forEach(input => input.addEventListener('input', handleInput));
  
  bookingTicketType.addEventListener('mousedown', e => e.preventDefault());
  bookingTicketType.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.toggle('booking-form__ticket-type-select-options_show');
  });
  
  ticketTypeSelectOptions.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.remove('booking-form__ticket-type-select-options_show');
    setBookingTicketTypeSelectValue(e.target.dataset.value);
  });
  
  bookingCloseBtn.addEventListener('click', hideBooking);
  
  document.querySelector('.tickets-form').addEventListener('formUpdate', setValuesFromTicketsForm)
  
  document.addEventListener('click', e => {
    if (isClickOutside(e, [
      'booking-form__ticket-type-select-options', 
      'booking-form__ticket-type-select'
    ])) {
      ticketTypeSelectOptions.classList.remove('booking-form__ticket-type-select-options_show');
    }
  
    if (isClickOutside(e, ['booking__container'])) {
      if (booking.classList.contains('booking_show'))
      hideBooking();
    }
  });

  setDateMinAttribute();
}