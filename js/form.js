import { checkMaxLength, isEscapeKey } from './util.js';
import { addPreviewControls, removePreviewControls } from './imagePreview.js';
import { setPreviewSource } from './imagePreview.js';
import { SEND_DATA_URL, handleFetch } from './keksApi.js';
import { showErrorMessage, showSuccessMessage } from './message.js';

const TAG_ERROR_MESSAGE = 'Неправильно заполнены тэги';
const COMMENT_ERROR_MESSAGE = 'Дляна комментария должна быть от 20 до 140 символов';

const SUBMIT_BUTTON_TEXT = ['Опубликовать', 'Публикую'];

const overlay = document.querySelector('.img-upload__overlay'),
  fileUpload = document.querySelector('#upload-file'),
  form = document.querySelector('#upload-select-image'),
  closeButton = document.querySelector('#upload-cancel'),
  submitButton = document.querySelector('#upload-submit'),
  hashtags = document.querySelector('.text__hashtags'),
  comment = document.querySelector('.text__description'),
  fileReader = new FileReader();

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-ipload__field-wrapper-error',
});

const areTagsUnique = (tags) => {
  const tagSet = new Set(tags);
  return tags.length === tagSet.size;
};

function checkTagRegex(tags) {
  const hashtagRegex = new RegExp('^$|^(#+[a-zA-Z0-9(_)]{1,})$');
  return (tags.every((tag) => tag.match(hashtagRegex)));
}

const validateHashtags = (value) => {
  const tags = value.trim().split(' ');
  return areTagsUnique(tags) && checkTagRegex(tags);
};

const validateComment = (value) => checkMaxLength(value, 140) && !checkMaxLength(value, 19);

function toggleSubmitButton() {
  submitButton.disabled ^= 1;
  submitButton.textContent = SUBMIT_BUTTON_TEXT[submitButton.disabled ? 1 : 0];
}

async function onFormSubmit(data) {
  try {
    await handleFetch(SEND_DATA_URL, 'POST', data);
    closeOverlay();
    showSuccessMessage();
  } catch (error) {
    showErrorMessage();
  }

}

function addValidation() {
  pristine.addValidator(hashtags, validateHashtags, TAG_ERROR_MESSAGE);
  pristine.addValidator(comment, validateComment, COMMENT_ERROR_MESSAGE);

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (pristine.validate()) {
      toggleSubmitButton();
      onFormSubmit(new FormData(form));
      toggleSubmitButton();
    }
  });
}

function clearForm() {
  fileUpload.value = '';
  hashtags.value = '';
  comment.value = '';
}

function openOverlay() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.body.addEventListener('keydown', onEscapeKeyDown);
  closeButton.addEventListener('click', closeOverlay);
}

function closeOverlay() {
  form.reset();
  pristine.reset();
  clearForm();

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.body.removeEventListener('keydown', onEscapeKeyDown);

  removePreviewControls();
}

fileReader.addEventListener('loadend', openOverlay);

function onImageUpload() {
  setPreviewSource(fileUpload.files[0]);
  fileReader.readAsDataURL(fileUpload.files[0]);

  addPreviewControls();
}

function onEscapeKeyDown(ev) {
  if (isEscapeKey(ev)) {
    ev.preventDefault();
    closeOverlay();
  }
}

export function openForm() {
  addValidation();
  fileUpload.addEventListener('change', onImageUpload);
}
