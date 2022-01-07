import './styles/index.scss';

import { init as initTicketsForm } from './js/tickets-form';
import initBooking from './js/booking';
import initVideo from './js/video';
import initBurgerMenu from './js/header-menu';
import CustomSlider from './js/slider';
import initComparingSlider from './js/comparing-slider';
import initGallery from './js/gallery';
import initMap from './js/map';

window.addEventListener('load', () => {
  initVideo();
  initTicketsForm();
  initBooking();
  initBurgerMenu();
  initComparingSlider();
  initGallery();
  initMap();

  const welcomeSlider = new CustomSlider(document.querySelector('.welcome-slider'), {
    animationDuration: 1200,
  });

  const videoSlider = new CustomSlider(document.querySelector('.video-slider'), {
    animationDuration: 400,
    slidesToShow: 3,
    rightMargin: 42,
    swiping: false
  });
});