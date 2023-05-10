import { clamp } from './util.js';

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;
const SCALE_STEP = 25;

const imagePreview = document.querySelector('.img-upload__preview img');
const imagePreviewDiv = document.querySelector('.img-upload__preview');
const sliderValue = document.querySelector('.effect-level__value');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderDiv = document.querySelector('.img-upload__effect-level');
const effectsRadio = document.querySelector('.effects__list');

const scaleValue = document.querySelector('.scale__control--value');
const buttonSmaller = document.querySelector('.scale__control--smaller');
const buttonBigger = document.querySelector('.scale__control--bigger');

const effects = {
  none: {
    filterName: 'none',
    min: 0,
    max: 0,
    step: 0,
    unit: ''
  },
  chrome: {
    filterName: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filterName: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filterName: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filterName: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filterName: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  },
};
let currentEffect = effects.none;

export function setPreviewSource(file) {
  imagePreview.src = URL.createObjectURL(file);
}

function resetScale() {
  scaleValue.value = `${SCALE_DEFAULT}%`;
  imagePreviewDiv.style.transform = `scale(${SCALE_DEFAULT / 100})`;
}

function onScaleButtonClick(ev) {
  ev.preventDefault();
  const currentScale = parseInt(scaleValue.value, 10);

  let newScale;
  if (ev.target.classList.contains('scale__control--bigger')) {
    newScale = clamp(currentScale + SCALE_STEP, SCALE_MIN, SCALE_MAX);
  } else {
    newScale = clamp(currentScale - SCALE_STEP, SCALE_MIN, SCALE_MAX);
  }

  scaleValue.value = `${newScale}%`;
  imagePreviewDiv.style.transform = `scale(${newScale / 100})`;
}

function resetEffects() {
  imagePreview.className = 'effects__preview--none';
  sliderDiv.classList.add('hidden');
  imagePreview.style.filter = `${effects.none.name}`;
  currentEffect = effects.none;
}

function changeSliderEffect(effect) {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max
    },
    start: effect.max,
    step: effect.step
  });
  currentEffect = effect;
}

function updateEffect() {
  const newValue = parseFloat(sliderElement.noUiSlider.get()).toFixed(2);

  imagePreview.style.filter = `${currentEffect.name}(${newValue}${currentEffect.unit})`;
  sliderValue.value = newValue;
}

function createEffectsSlider() {
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 10,
  });
  sliderDiv.classList.add('hidden');
  sliderElement.noUiSlider.on('update', updateEffect);
}

function onEffectChange(ev) {
  if (ev.target.value === 'none') {
    sliderDiv.classList.add('hidden');
  } else {
    sliderDiv.classList.remove('hidden');
  }

  currentEffect = effects[ev.target.value];
  changeSliderEffect(currentEffect);
  imagePreview.className = `effects__preview--${ev.target.value}`;
}

export function addPreviewControls() {
  buttonBigger.addEventListener('click', onScaleButtonClick);
  buttonSmaller.addEventListener('click', onScaleButtonClick);

  createEffectsSlider();
  effectsRadio.addEventListener('change', onEffectChange);

  resetScale();
  resetEffects();
}

export function removePreviewControls() {
  buttonBigger.removeEventListener('click', onScaleButtonClick);
  buttonSmaller.removeEventListener('click', onScaleButtonClick);

  sliderElement.noUiSlider.destroy();
  effectsRadio.removeEventListener('change', onEffectChange);
}
