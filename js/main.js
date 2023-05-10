//Задание 7 часть 2
import { drawMiniatures } from './dom.js';
import { openForm } from './form.js';

fetch('https://27.javascript.pages.academy/kekstagram-simple/data')
  .then((response) => response.json())
  .then((json) => drawMiniatures(json));

openForm();
