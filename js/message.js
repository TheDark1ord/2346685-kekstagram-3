import { isEscapeKey } from './util.js';

const messageSuccess = document.querySelector('#success').content;
const messageError = document.querySelector('#error').content;

function closeMessage(ev) {
  if (ev.target.nodeName === 'BUTTON' || isEscapeKey(ev)) {
    document.querySelector('section.success, section.error').remove();
    document.removeEventListener('click', closeMessage);
    document.removeEventListener('keydown', closeMessage);
  }
}

export function showSuccessMessage() {
  document.body.append(messageSuccess.cloneNode(true));
  document.addEventListener('click', closeMessage);
  document.addEventListener('keydown', closeMessage);
}

export function showErrorMessage() {
  document.body.append(messageError.cloneNode(true));
  document.addEventListener('click', closeMessage);
  document.addEventListener('keydown', closeMessage);
}
