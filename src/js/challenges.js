import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion, completeFromList } from '@codemirror/autocomplete';
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 300;

let currentLanguage = 'cpp';
let view;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(10, 10, 380, 380);
  ctx.fillStyle = '#222';
  ctx.font = '30px Arial';
  ctx.fillText('PDF Reader Here', 100, 200);
}

const selectElement = document.getElementById('language-select');
selectElement.value = 'cpp';
selectElement.addEventListener('change', function() {
  const selectedValue = selectElement.value;
  console.log(`You selected: ${selectedValue}`);
  setLanguage(selectedValue);
});

draw();

function initEditor(language) {
  const startState = EditorState.create({
    doc: '',
    extensions: [basicSetup, getLanguageExtension(language), autocompletion()]
  });

  view = new EditorView({
    state: startState,
    parent: document.getElementById("editor")
  });
}

function getLanguageExtension(language) {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'c':
      return cpp();
    case 'cpp':
      return cpp();
    default:
      return javascript();
  }
}

function setLanguage(language) {
  view.destroy();
  initEditor(language);
}

initEditor(currentLanguage);
