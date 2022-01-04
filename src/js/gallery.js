import { importAll, shuffle, throttle } from './helpers';

const images = importAll(require.context('../pictures/gallery/', false, /gallery[0-9]*.(jpe?g)$/));
const galleryColumns = document.querySelectorAll('.gallery__column');
const gallery = document.querySelector('.gallery');
const galleryItems = [];

function createImage(src) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = src.match(/^.*\/(gallery[0-9]*)-.*$/)[1] || 'gallery';
  img.classList.add('gallery__item');
  return img;
}

function revealGalleryItems(e) {
  const windowHeight = window.innerHeight;
  const { top, bottom } = gallery.getBoundingClientRect();
  if (top > windowHeight || bottom < 0) {
    return;
  }

  galleryItems.forEach(item => {
    const elementTop = item.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      item.classList.add("gallery__item_active");
    } else {
      item.classList.remove("gallery__item_active");
    }
  });
}

// TODO: try to use IntersectionObserver for reveal, just for fun
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    entry.isIntersecting
      ? entry.target.classList.add('gallery__item_active')
      : entry.target.classList.remove('gallery__item_active');
  })
};

const galleryItemsObserver = new IntersectionObserver(
  handleIntersection,
  {
    rootMargin: "0px 0px -100px 0px"
  }
);

export default function init() {
  const shuffledImages = shuffle(images);
  const chunkSize = Math.trunc(shuffledImages.length / 3);

  Array.prototype.forEach.call(galleryColumns, (column, i) => {
    shuffledImages
      .slice(i * chunkSize, (i + 1) * chunkSize)
      .forEach(imgSrc => {
        const img = createImage(imgSrc);
        galleryItems.push(img);
        column.append(img);
        // galleryItemsObserver.observe(img);
      });
  });

    
  window.addEventListener("scroll", throttle(100, revealGalleryItems));
  revealGalleryItems();
}