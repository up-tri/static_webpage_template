/* eslint-disable @typescript-eslint/explicit-function-return-type */

import '../scss/app.scss';

(() => {
  console.log('loaded js');
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded DOM');
});

window.onload = () => {
  console.log('loaded image');
};
