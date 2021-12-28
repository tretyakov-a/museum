import './styles/index.scss';

const bookingDateInput = document.querySelector('.booking-form__date-input');
const bookingTimeInput = document.querySelector('.booking-form__time-input');
const bookingTicketTypeSelect = document.querySelector('.booking-form__ticket-type-select');

function handleInput(e) {
  const value = e.target.localName === 'input'
    ? e.target.value
    : e.target.querySelector(`[value="${e.target.value}"]`).textContent;
  e.target.previousElementSibling.previousElementSibling.value = value;
}
bookingDateInput.addEventListener('input', handleInput);
bookingTimeInput.addEventListener('input', handleInput);
bookingTicketTypeSelect.addEventListener('change', handleInput);


const inputRangeElements = document.querySelectorAll('.custom-input-range');

for (const el of inputRangeElements) {
  el.addEventListener('input', () => {
    const value = el.value;
    el.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #c4c4c4 ${value}%, #c4c4c4 100%)`
  })
}

 