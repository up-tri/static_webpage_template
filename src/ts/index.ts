/* eslint-disable @typescript-eslint/explicit-function-return-type */
(() => {
  console.log('loaded js');
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded DOM');
});

window.onload = () => {
  console.log('loaded image');
};
