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
    this.slides = [...this.sliderContainer.querySelectorAll(SELECTORS.slide)];
    this.dots = this.sliderContainer.querySelectorAll(SELECTORS.dot);
    this.counterCurrent = this.sliderContainer.querySelector(SELECTORS.counterCurrent);
    this.slidesNumber = this.slides.length;

    this.currentSlideIndex = -1;
    this.touchstartX = 0;
    this.touchendX = 0;
    this.animationDuration = options.animationDuration || 800;
    this.slidesToShow = options.slidesToShow || 1;
    this.rightMargin = options.rightMargin || 0;
    this.onChange = options.onChange || null;
    
    if (this.slidesNumber <= this.slidesToShow) {
      return;
    }

    const firstSlides = [];
    for (let i = 0; i < this.slidesToShow; i += 1) {
      firstSlides.push(this.slides[i].cloneNode(true));
    }
    
    const lastSlides = [];
    for (let i = 0; i < this.slidesToShow; i += 1) {
      lastSlides.push(this.slides[this.slidesNumber - 1 - i].cloneNode(true));
    }
    
    this.insertSlidesBefore(lastSlides);
    this.appendSlides(firstSlides);

    this.setCounter(this.sliderContainer.querySelector(SELECTORS.counterTotal), this.slidesNumber);
  
    this.sliderContainer.querySelector(SELECTORS.controls)
      .addEventListener('click', this.handleControlsClick);
  
    this.sliderContent.addEventListener('touchstart', this.handleTouchStart);
    this.sliderContent.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('resize', throttle(100, this.handleWindowResize));
    
    this.changeCurrentIndex = debounce(this.animationDuration, this.changeCurrentIndex);

    setTimeout(() => {
      this.changeCurrentIndex(0);
      setTimeout(this.addTransition);
    });
  }

  insertSlidesBefore = slides => {
    for (let i = slides.length - 1; i >= 0; i -= 1) {
      this.sliderContent.insertBefore(slides[i], this.slides[0]);
    }
  }

  appendSlides = slides => {
    slides.forEach(slide => {
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
    this.dots[this.currentSlideIndex].classList.add(activeModificator);
  }
  
  setCounter = (counterElement, n = this.currentSlideIndex + 1) => {
    if (!counterElement) {
      return;
    }
    const text = n < 10 ? '0' + n : n;
    counterElement.textContent = text;
  }
  
  changeCurrentIndex = (newIndex, edge = null) => {
    if (this.currentSlideIndex === +newIndex) {
      return;
    }
    this.currentSlideIndex = +newIndex;
    this.setActiveDot();
    this.setCounter(this.counterCurrent);
    this.moveSlider(edge);

    // if (this.onChange) {
    //   this.onChange.call(null, this.currentSlideIndex);
    // }

    const event = new Event('slideChange');
    event.currentSlide = this.currentSlideIndex;
    this.sliderContainer.dispatchEvent(event);
  }
  
  processEdgeSlideMove = (offset, offsetEdge) => {
    setTimeout(() => {
      this.sliderContent.style.left = `-${offsetEdge}px`;
      setTimeout(() => {
        this.removeTransition();
        this.sliderContent.style.left = `-${offset}px`;
        setTimeout(this.addTransition, 20);
      }, this.animationDuration - 20);
    });
  }
  
  moveSlider = (edge = null) => {
    const slide = this.slides[this.currentSlideIndex];
    const offset = slide.offsetLeft;
    
    if (edge && (edge.right || edge.left)) {
      const edgeSlide = edge.right ? this.slides[this.slidesNumber - 1] : this.slides[0];
      const width = edgeSlide.offsetWidth + this.rightMargin;
      const offsetEdge = edgeSlide.offsetLeft + (edge.right ? width : -width);
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
    this.sliderContent.style.transition = `${this.animationDuration}ms ease-in-out`;
  }
  
  removeTransition = () => {
    this.sliderContent.style.transition = `none`;
  }
}
