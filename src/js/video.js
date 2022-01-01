const inputRangeElements = document.querySelectorAll('.custom-input-range');

export default function init() {
  for (const el of inputRangeElements) {
    el.addEventListener('input', () => {
      const value = el.value;
      el.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #c4c4c4 ${value}%, #c4c4c4 100%)`
    })
  }
}