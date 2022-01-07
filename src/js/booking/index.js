import { init as initForm } from './booking-form';
import { isClickOutside } from '../helpers';

const booking = document.querySelector('.booking');
const bookingCloseBtn = document.querySelector('.booking__close-btn');

function hideBooking() {
  booking.classList.remove('booking_show');
  booking.classList.add('booking_hide');
  setTimeout(() => {
    booking.classList.remove('booking_hide');
  }, 400);
}

function handleDocumentClick(e) {
  if (isClickOutside(e, ['booking__container'])) {
    if (booking.classList.contains('booking_show'))
    hideBooking();
  }
}

export default function init() {
  initForm();

  bookingCloseBtn.addEventListener('click', hideBooking);
  document.addEventListener('click', handleDocumentClick);
}