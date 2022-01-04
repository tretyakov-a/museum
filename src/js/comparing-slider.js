
const slider = document.querySelector('.comparing-slider__control');
const after = document.querySelector('.comparing-slider__after');
const before = document.querySelector('.comparing-slider__before-container');

let sliderMouseDown = false;

function moveSlider(clientX) {
  const { x: afterX, width: afterWidth } = after.getBoundingClientRect();
  const cx = clientX || afterX + afterWidth / 2;
  const sliderX = cx < afterX ? 0 : (cx > afterX + afterWidth ? afterWidth : cx - afterX);

  const width = ((sliderX / afterWidth) * 100).toFixed(2);
  const left = (((sliderX - slider.offsetWidth / 2) / afterWidth) * 100).toFixed(2);

  before.style.width = `${width}%`;
  slider.style.left = `${left}%`;
}

function handleDocumentMouseMove(e) {
  if (sliderMouseDown) {
    moveSlider(e.clientX);
  }
}

function handleDocumentMouseUp() {
  if (sliderMouseDown) {
    sliderMouseDown = false;
    slider.classList.remove('comparing-slider__control_active');
  }
}

function handleSliderMouseDown() {
  sliderMouseDown = true;
  slider.classList.add('comparing-slider__control_active');
}

export default function init() {
  slider.addEventListener('mousedown', handleSliderMouseDown);

  document.addEventListener('mousemove', handleDocumentMouseMove);
  document.addEventListener('mouseup', handleDocumentMouseUp);
  
  moveSlider();
}