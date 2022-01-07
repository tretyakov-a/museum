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

export function importAll(r) {
  return r.keys().map(r);
};

export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function toCamelCase(s) {
  return s.split('-')
    .map((word, i) => i !== 0 ? word[0]
    .toUpperCase() + word.slice(1) : word)
    .join('');
}