import './styles/index.scss';

import initBooking from './js/booking';
import initVideo from './js/video';
import initBurgerMenu from './js/header-menu';
import CustomSlider from './js/slider';

window.addEventListener('load', () => {
  initVideo();
  initBooking();
  initBurgerMenu();

  const welcomeSlider = new CustomSlider(document.querySelector('.welcome-slider'), {
    animationDuration: 600,
  });

  const videoSlider = new CustomSlider(document.querySelector('.video-slider'), {
    animationDuration: 200,
    slidesToShow: 3,
    rightMargin: 42
  });
});