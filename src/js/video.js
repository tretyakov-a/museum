
import 'custom-video/dist/main.css';
import CustomVideoPlayer from 'custom-video';
import { importAll } from './helpers';

const posters = importAll(require.context('../pictures/video/', false, /poster[0-9]*.(jpe?g)$/));
const videos = importAll(require.context('../assets/video/videos/', false, /video[0-9]*.mp4$/));
let players = [];
let video = null;

function handlePlayerReady(e) {
}

function handlePlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    video.pause();

    players.forEach(player => {
      if (player !== e.target && player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    })
  }
}

function pauseSliderVideos() {
  players.forEach(player => {
    if (player.getPlayerState && player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    }
  })
}

function handleMainVideoPlay() {
  pauseSliderVideos();
}


function slideChangeHandler(e) {
  video.pause();
  video.poster = posters[e.currentSlide];
  video.setAttribute('src', videos[e.currentSlide]);
  video.load();
  pauseSliderVideos();
}

export default function init() {

  const iframes = document.querySelectorAll('.video-slider__item iframe');

  for (const iframe of iframes) {
    players.push(new YT.Player(iframe, {
      events: {
        'onReady': handlePlayerReady,
        'onStateChange': handlePlayerStateChange
      }
    }));
  }

  video = document.querySelector('.video__img');
  const videoPlayer = new CustomVideoPlayer(video, {
    colors: {
      theme: '#9d8665',
    }
  });

  video.addEventListener('play', handleMainVideoPlay);
  document.querySelector('.video-slider').addEventListener('slideChange', slideChangeHandler);
}