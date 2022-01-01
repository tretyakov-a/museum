export function isClickOutside(e, classNames) {
  return classNames.every(className => !e.path.find(el => {
    return el.classList && el.classList.contains(className);
  }));
}