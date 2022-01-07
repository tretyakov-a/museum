import { throttle } from '../js/helpers';

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
    this.slides = [...this.sliderContainer.querySelectorAll(SELECTORS.slide)];
    this.dots = this.sliderContainer.querySelectorAll(SELECTORS.dot);
    this.counterCurrent = this.sliderContainer.querySelector(SELECTORS.counterCurrent);
    
    this.slidesNumber = this.slides.length;
    this.isMoving = false;
    this.isSwiping = false;
    this.currentSlideIndex = 0;
    this.sliderContentStartX = 0;
    this.sliderContentCurrentX = 0;
    this.swipeThreshold = 0.2 * this.slides[0].offsetWidth;
    this.animationDuration = options.animationDuration || 800;
    this.slidesToShow = options.slidesToShow || 1;
    this.rightMargin = options.rightMargin || 0;
    
    if (this.slidesNumber <= this.slidesToShow) {
      return;
    }
    
    this.insertCloneSlidesBefore();
    this.appendCloneSlides();

    this.setCounter(this.sliderContainer.querySelector(SELECTORS.counterTotal), this.slidesNumber);
  
    this.sliderContainer.querySelector(SELECTORS.controls)
      .addEventListener('click', this.handleControlsClick);
  
    this.sliderContent.addEventListener('mousedown', this.handleTouchStart);
    this.sliderContent.addEventListener('touchstart', this.handleTouchStart);
    this.sliderContent.addEventListener('touchmove', this.handleTouchMove);
    this.sliderContent.addEventListener('touchend', this.handleTouchEnd);

    this.sliderContent.addEventListener('transitionend', this.handleTransitionEnd);

    window.addEventListener('resize', throttle(100, this.handleWindowResize));

    this.handleWindowResize();
  }

  setStartPosition = () => {
    const offset = this.slides[0].offsetWidth * this.slidesToShow;
    this.sliderContent.style.left = `-${offset}px`;
  }

  insertCloneSlidesBefore = () => {
    const lastSlides = [];
    for (let i = 0; i < this.slidesToShow; i += 1) {
      lastSlides.push(this.slides[this.slidesNumber - 1 - i].cloneNode(true));
    }
    for (let i = lastSlides.length - 1; i >= 0; i -= 1) {
      this.sliderContent.insertBefore(lastSlides[i], this.slides[0]);
    }
  }

  appendCloneSlides = () => {
    const firstSlides = [];
    for (let i = 0; i < this.slidesToShow; i += 1) {
      firstSlides.push(this.slides[i].cloneNode(true));
    }
    firstSlides.forEach(slide => {
      this.sliderContent.append(slide);
    })
  }

  setActiveDot = () => {
    if (!this.dots) {
      return;
    }
    const className = this.dots[0].classList[0];
    const activeModificator = `${className}_active`;
    for (const dot of this.dots) {
      dot.classList.remove(activeModificator);
    }
    const currentIndex = this.getFixedCurrentIndex();
    this.dots[currentIndex].classList.add(activeModificator);
  }
  
  setCounter = (counterElement, n = this.currentSlideIndex) => {
    if (!counterElement) {
      return;
    }
    n += 1;
    const text = n < 10 ? '0' + n : n;
    counterElement.textContent = text;
  }
  
  moveToSlideIndex = (newIndex, dx) => {
    if (this.currentSlideIndex === +newIndex || this.isMoving) {
      return;
    }
    
    this.currentSlideIndex = +newIndex;
    this.setActiveDot();
    this.setCounter(this.counterCurrent, this.getFixedCurrentIndex());
    this.moveSlider(dx);

    const event = new Event('slideChange');
    event.currentSlide = this.getFixedCurrentIndex();
    this.sliderContainer.dispatchEvent(event);
  }

  calculateTransition = (dx, revert = false) => {
    const slideWidth = this.slides[0].offsetWidth;
    const part = Math.abs(dx) % slideWidth / slideWidth;
    const transition = (revert ? part : 1 - part) * this.animationDuration;
    return transition;
  }

  moveSlider = (dx = 0) => {
    this.isMoving = true;
    this.addTransition(this.calculateTransition(dx));

    let offset = 0;
    const rightEdge = this.currentSlideIndex === this.slidesNumber;
    const leftEdge = this.currentSlideIndex < 0;
    if (leftEdge || rightEdge) {
      const edgeSlide = rightEdge ? this.slides[this.slidesNumber - 1] : this.slides[0];
      const width = edgeSlide.offsetWidth + this.rightMargin;
      offset = edgeSlide.offsetLeft + (rightEdge ? width : -width);
    } else {
      offset = this.slides[this.currentSlideIndex].offsetLeft;
    }
    
    this.sliderContent.style.left = `-${offset}px`;
  }
  
  handleDotClick = (data) => {
    this.moveToSlideIndex(data.index);
  }
  
  handleControlsClick = (e) => {
    const btn = e.target.closest('[data-role]');
    if (!btn) {
      return;
    }
    switch (btn.dataset.role) {
      case 'dot': this.handleDotClick(btn.dataset); break;
      case 'prev-btn': this.moveToSlideIndex(this.currentSlideIndex - 1); break;
      case 'next-btn': this.moveToSlideIndex(this.currentSlideIndex + 1); break;
    }
  }
  
  getFixedCurrentIndex = () => {
    if (this.currentSlideIndex < 0) {
      return this.slidesNumber - 1;
    } else if (this.currentSlideIndex === this.slidesNumber) {
      return 0;
    }
    return this.currentSlideIndex;
  }

  handleTransitionEnd = () => {
    this.isMoving = false;
    this.removeTransition();
    
    const fixedIndex = this.getFixedCurrentIndex();
    if (this.currentSlideIndex !== fixedIndex) {
      this.currentSlideIndex = fixedIndex;
      this.sliderContent.style.left = `-${this.slides[this.currentSlideIndex].offsetLeft}px`;
    }
   
    setTimeout(this.addTransition);
  }
  
  handleTouchStart = (e) => {
    e.preventDefault();
    if (this.isMoving) {
      return;
    }
    this.isSwiping = true;
    this.removeTransition();
    this.sliderContentStartX = this.sliderContent.offsetLeft;
    if (e.type == 'touchstart') {
      this.sliderContentCurrentX = e.touches[0].clientX;
    } else {
      this.sliderContentCurrentX = e.clientX;
      document.addEventListener('mouseup', this.handleTouchEnd);
      document.addEventListener('mousemove', this.handleTouchMove);
    }
  }
  
  handleTouchEnd = (e) => {
    if (this.isMoving || !this.isSwiping) {
      return;
    }
    this.isSwiping = false;
    const dx = this.sliderContent.offsetLeft - this.sliderContentStartX;
    this.addTransition(this.calculateTransition(dx, true));

    if (dx > this.swipeThreshold) {
      this.moveToSlideIndex(this.currentSlideIndex - 1, dx);
    } else if (dx < -this.swipeThreshold) {
      this.moveToSlideIndex(this.currentSlideIndex + 1, dx);
    } else {
      this.sliderContent.style.left = `${this.sliderContentStartX}px`;
    }
    document.removeEventListener('mouseup', this.handleTouchEnd);
    document.removeEventListener('mousemove', this.handleTouchMove);
  }

  handleTouchMove = (e) => {
    if (this.isMoving || !this.isSwiping) {
      return;
    }
    
    const clientX = e.type == 'touchmove' ? e.touches[0].clientX : e.clientX;
    const dx = this.sliderContentCurrentX - clientX;
    this.sliderContentCurrentX = clientX;

    this.sliderContent.style.left = (this.sliderContent.offsetLeft - dx) + 'px';
  }
  
  handleWindowResize = (e) => {
    this.moveSlider();
    this.handleTransitionEnd();
    this.swipeThreshold = 0.2 * this.slides[0].offsetWidth;
  }
  
  addTransition = (transition = this.animationDuration) => {
    this.sliderContent.style.transition = `${transition}ms ease-in-out`;
  }
  
  removeTransition = () => {
    this.sliderContent.style.transition = `none`;
  }
}
