import './styles/index.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

import initTicketsForm from './js/tickets-form';
import initBookingForm from './js/booking-form';
import initVideo from './js/video';
import initBurgerMenu from './js/header-menu';
import CustomSlider from './js/slider';
import initComparingSlider from './js/comparing-slider';
import initGallery from './js/gallery';
import initMap from './js/map';

window.addEventListener('load', () => {
  initVideo();
  initTicketsForm();
  initBookingForm();
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
    rightMargin: 42
  });
});