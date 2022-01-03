import { debounce, throttle } from '../js/helpers';

const setSelector = role => `[data-role="${role}"]`;

const SELECTORS = {
  'dot': setSelector('dot'),
  'controls': setSelector('controls'),
  'content': setSelector('content'),
  'slide': setSelector('slide'),
  'counterCurrent': setSelector('counter-current'),
  'counterTotal': setSelector('counter-total'),
}

export default class CustomSlider {
  constructor(slider, options = {}) {
    this.sliderContainer = slider;
    this.sliderContent = this.sliderContainer.querySelector(SELECTORS.content);
    this.slides = this.sliderContainer.querySelectorAll(SELECTORS.slide);
    this.dots = this.sliderContainer.querySelectorAll(SELECTORS.dot);
    this.counterCurrent = this.sliderContainer.querySelector(SELECTORS.counterCurrent);
    this.slidesNumber = this.slides.length;

    this.currentSlideIndex = 0;
    this.touchstartX = 0;
    this.touchendX = 0;
    this.animationDuration = options.animationDuration || 800;
    
    const firstSlide = this.slides[0].cloneNode(true);
    firstSlide.dataset.index = -1;
    const lastSlide = this.slides[this.slidesNumber - 1].cloneNode(true);
    lastSlide.dataset.index = -1;
  
    this.sliderContent.insertBefore(lastSlide, this.slides[0]);
    this.sliderContent.append(firstSlide);

    this.setCounter(this.sliderContainer.querySelector(SELECTORS.counterTotal), this.slidesNumber);
  
    this.sliderContainer.querySelector(SELECTORS.controls)
      .addEventListener('click', this.handleControlsClick);
  
    this.sliderContent.addEventListener('touchstart', this.handleTouchStart);
    this.sliderContent.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('resize', throttle(100, this.handleWindowResize));
  
    setTimeout(() => {
      this.changeCurrentIndex(0);
      setTimeout(this.addTransition)
    });

    this.changeCurrentIndex = debounce(this.animationDuration, this.changeCurrentIndex);
  }

  setActiveDot = () => {
    for (const dot of this.dots) {
      dot.classList.remove('welcome-slider__dot_active');
    }
    this.dots[this.currentSlideIndex].classList.add('welcome-slider__dot_active');
  }
  
  setCounter = (counterEl, n = this.currentSlideIndex + 1) => {
    const text = n < 10 ? '0' + n : n;
    counterEl.textContent = text;
  }
  
  changeCurrentIndex = (newIndex, edge = null) => {
    if (this.currentSlideIndex === +newIndex) {
      return;
    }
    this.currentSlideIndex = +newIndex;
    this.setActiveDot();
    this.setCounter(this.counterCurrent);
    this.moveSlider(edge);
  }
  
  processEdgeSlideMove = (offset, offsetEdge) => {
    setTimeout(() => {
      this.sliderContent.style.left = `-${offsetEdge}px`;
      setTimeout(() => {
        this.removeTransition();
        this.sliderContent.style.left = `-${offset}px`;
        setTimeout(this.addTransition, 20);
      }, this.animationDuration);
    });
  }
  
  moveSlider = (edge = null) => {
    const slide = this.slides[this.currentSlideIndex];
    const offset = slide.offsetLeft;
  
    if (edge && (edge.right || edge.left)) {
      const edgeSlide = edge.right ? this.slides[this.slidesNumber - 1] : this.slides[0];
      const offsetEdge = edgeSlide.offsetLeft + (edge.right ? edgeSlide.offsetWidth : -edgeSlide.offsetWidth);
      return this.processEdgeSlideMove(offset, offsetEdge);
    }
  
    this.sliderContent.style.left = `-${offset}px`;
  }
  
  handleDotClick = (data) => {
    this.changeCurrentIndex(data.index);
  }
  
  handleNextClick = () => {
    let newIndex = this.currentSlideIndex + 1;
    let rightEdge = newIndex === this.slidesNumber;
    if (rightEdge) {
      newIndex = newIndex % this.slidesNumber;
    }
    this.changeCurrentIndex(newIndex, { right: rightEdge });
  }
  
  handlePrevClick = () => {
    let newIndex = this.currentSlideIndex - 1;
    let leftEdge = newIndex < 0;
    if (leftEdge) {
      newIndex = this.slidesNumber - 1;
    }
    this.changeCurrentIndex(newIndex, { left: leftEdge });
  }
  
  handleControlsClick = (e) => {
    const btn = e.target.closest('[data-role]');
    if (!btn) {
      return;
    }
    switch (btn.dataset.role) {
      case 'dot': this.handleDotClick(btn.dataset); break;
      case 'prev-btn': this.handlePrevClick(); break;
      case 'next-btn': this.handleNextClick(); break;
    }
  }
  
  handleGesture = () => {
    if (this.touchendX < this.touchstartX) {
      this.handleNextClick();
    }
    if (this.touchendX > this.touchstartX) {
      this.handlePrevClick();
    }
  }
  
  handleTouchStart = (e) => {
    this.touchstartX = e.changedTouches[0].screenX;
  }
  
  handleTouchEnd = (e) => {
    this.touchendX = e.changedTouches[0].screenX;
    this.handleGesture();
  }
  
  handleWindowResize = (e) => {
    this.removeTransition();
    this.moveSlider();
    setTimeout(() => {
      this.addTransition();
    });
  }
  
  addTransition = () => {
    this.sliderContent.style.transition = `${this.animationDuration}ms ease-in`;
  }
  
  removeTransition = () => {
    this.sliderContent.style.transition = `none`;
  }
}
