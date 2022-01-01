const menuHamburgerClass = 'menu-hamburger';
const headerMenuClass = 'header-menu';
const headerNavClass = 'header__nav';

const hamburger = document.querySelector(`.${menuHamburgerClass}`);
const headerMenu = document.querySelector(`.${headerMenuClass}`);
const headerNav = document.querySelector(`.${headerNavClass}`);
const welcomeInner = document.querySelector('.welcome__inner');

const headerNavShowModificator = `${headerNavClass}_show`;
const hideModificator = `${headerMenuClass}_hide`;
const humburgerHideModificator = `${menuHamburgerClass}_hide`;
const animationDuration = 200;

function handleDocumentClick(e) {
  const isShowed = headerNav.classList.contains(headerNavShowModificator);
  const isClickOnCloseBtn = e.target.closest(`.${menuHamburgerClass}`);
  const isClickOutsideMenu = !e.path.find(el => el.classList && el.classList.contains(headerMenuClass));
  const isClickOnLink = e.path.find(el => el.classList && el.classList.contains(`${headerMenuClass}__item-link`));
  
  if (isClickOnCloseBtn && !isShowed) {
    welcomeInner.style.display = 'none';
    headerNav.classList.add(headerNavShowModificator);
  }

  if (isShowed && (isClickOutsideMenu || isClickOnLink)) {
    hide();
  }
}

function hide() {
  welcomeInner.style.display = 'block';
  headerNav.classList.remove(headerNavShowModificator);
  hamburger.classList.add(humburgerHideModificator);
  headerMenu.classList.add(hideModificator);

  setTimeout(() => {
    headerMenu.classList.remove(hideModificator);
    hamburger.classList.remove(humburgerHideModificator);
  }, animationDuration);
}

export default function initHeaderMenu() {
  // hamburger.addEventListener('click', toggle);
  document.addEventListener('click', handleDocumentClick);
}