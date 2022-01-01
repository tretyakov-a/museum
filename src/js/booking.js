import { isClickOutside } from './helpers';

const bookingDateInput = document.querySelector('.booking-form__date-input');
const bookingTimeInput = document.querySelector('.booking-form__time-input');
const bookingTicketTypeSelect = document.querySelector('.booking-form__ticket-type-select');
const creditCardMonthSelect = document.querySelector('.credit-card__month-select');
const creditCardYearSelect = document.querySelector('.credit-card__year-select');
const ticketTypeSelectOptions = document.querySelector('.booking-form__ticket-type-select-options');

const ticketFormSubmit = document.querySelector('.tickets-form__submit');
const booking = document.querySelector('.booking');
const bookingCloseBtn = document.querySelector('.booking__close-btn');

function handleInput(e) {
  const value = e.target.localName === 'input'
    ? e.target.value
    : e.target.querySelector(`[value="${e.target.value}"]`).textContent;
  e.target.previousElementSibling.previousElementSibling.value = value;
}

function hideBooking() {
  booking.classList.remove('booking_show');
  booking.classList.add('booking_hide');
  setTimeout(() => {
    booking.classList.remove('booking_hide');
  }, 400);
}

export default function init() {
  
  bookingDateInput.addEventListener('input', handleInput);
  bookingTimeInput.addEventListener('input', handleInput);
  bookingTicketTypeSelect.addEventListener('change', handleInput);
  creditCardMonthSelect.addEventListener('change', handleInput);
  creditCardYearSelect.addEventListener('change', handleInput);
  
  bookingTicketTypeSelect.addEventListener('mousedown', e => e.preventDefault());
  bookingTicketTypeSelect.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.toggle('booking-form__ticket-type-select-options_show');
  });
  
  ticketTypeSelectOptions.addEventListener('click', e => {
    ticketTypeSelectOptions.classList.remove('booking-form__ticket-type-select-options_show');
    console.log(e.target.dataset.value);
    bookingTicketTypeSelect.value = e.target.dataset.value;
    bookingTicketTypeSelect.dispatchEvent(new Event('change'));
  });
  
  bookingCloseBtn.addEventListener('click', hideBooking);
  
  ticketFormSubmit.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    booking.classList.add('booking_show');
  });
  
  
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
}