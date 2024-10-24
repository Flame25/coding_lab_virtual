import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion, completeFromList } from '@codemirror/autocomplete';

let currentLanguage = 'cpp'
let view;

document.addEventListener('mousemove', function(e) {
  const sidebar = document.getElementById('sidebar');

  if (e.clientX < 60) {
    sidebar.classList.add('show');
  } else {
    sidebar.classList.remove('show');
  }
});

document.getElementById('clear-button').addEventListener('click', function() {
  const text_area = document.getElementById('compiled');
  text_area.value = "";
});

document.getElementById('python_lang').addEventListener('click', function() {
  const text = document.getElementById('centered-box');
  text.innerText = "main.py";
  setLanguage('python');
});

document.getElementById('cpp_lang').addEventListener('click', function() {
  const text = document.getElementById('centered-box');
  text.innerText = "main.cpp";
  setLanguage('cpp');
});

document.getElementById('c_lang').addEventListener('click', function() {
  const text = document.getElementById('centered-box');
  text.innerText = "main.c";
  setLanguage('c');
});

document.getElementById('js_lang').addEventListener('click', function() {
  const text = document.getElementById('centered-box');
  text.innerText = "main.js";
  setLanguage('javascript');
});

function initEditor(language) {
  const startState = EditorState.create({
    doc: '', // Initial empty document
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
// Change mode on button click
//document.getElementById('changeMode').addEventListener('click', () => {
//  const currentMode = view.state.facet(cpp);
//  if (currentMode) {
//    view.dispatch({
//      changes: { from: 0, to: view.state.doc.length, insert: "" },
//      effects: EditorView.updateListener.of(() => view.state.update({
//        effects: EditorView.changeLineMode.of(cpp())
//      }))
//    });
//  } else {
//    // If not in C++, set to C++
//    view.dispatch({
//      changes: { from: 0, to: view.state.doc.length, insert: "" },
//      effects: EditorView.updateListener.of(() => view.state.update({
//        effects: EditorView.changeLineMode.of(cpp())
//      }))
//    });
//  }
//});
