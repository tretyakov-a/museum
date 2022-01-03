import './styles/index.scss';

import initBooking from './js/booking';
import initVideo from './js/video';
import initBurgerMenu from './js/header-menu';
import CustomSlider from './js/slider';

document.addEventListener('DOMContentLoaded', () => {
  initVideo();
  initBooking();
  initBurgerMenu();
  const welcomeSlider = new CustomSlider(document.querySelector('.welcome-slider'), {
    animationDuration: 600,
  });
});