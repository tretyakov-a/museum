export function isClickOutside(e, classNames) {
  return classNames.every(className => !e.path.find(el => {
    return el.classList && el.classList.contains(className);
  }));
}

export const debounce = (ms, fn) => {
  let cooldown = false;
  return (...args) => {
    if (!cooldown) {  

      fn.apply(null, args);
      cooldown = true;

      setTimeout(() => {
        cooldown = false;
      }, ms);
    }
  }
}

export const throttle = (ms, fn) => {
  let cooldown = false;
  let savedArgs = null;

  function wrapper(...args) {
    if (cooldown) {
      savedArgs = args;
      return;
    }
    cooldown = true;
    fn.apply(null, args);

    setTimeout(() => {
      cooldown = false;
      if (savedArgs) {
        wrapper.apply(null, savedArgs);
        savedArgs = null;
      }
    }, ms);
  }
  return wrapper;
};