import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

let currentLanguage = "cpp";
let currentNum = 1;
let view;

const selectElement = document.getElementById("language-select");
selectElement.value = "cpp";
selectElement.addEventListener("change", function () {
  const selectedValue = selectElement.value;
  console.log(`You selected: ${selectedValue}`);
  setLanguage(selectedValue);
});

function initEditor(language) {
  const startState = EditorState.create({
    doc: "",
    extensions: [basicSetup, getLanguageExtension(language), autocompletion()],
  });

  view = new EditorView({
    state: startState,
    parent: document.getElementById("editor"),
  });
}

function getLanguageExtension(language) {
  switch (language) {
    case "python":
      return python();
    case "c":
      return cpp();
    case "cpp":
      return cpp();
    default:
      return cpp();
  }
}
document.getElementById("run").addEventListener("click", function () {
  const code = getEditorValue();
  console.log(code);
  fetch("http://localhost:3000/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ code: code, lang: currentLanguage }),
  })
    .then((response) => response.text())
    .then((result) => {
      document.getElementById("output").innerText = result;
    })
    .catch((error) => {
      document.getElementById("output").innerText = "Error: " + error;
    });
});

document.getElementById("send").addEventListener("click", function () {
  const code = getEditorValue();
  console.log(code);
  fetch("http://localhost:3000/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      lang: currentLanguage,
      num: currentNum,
    }),
  })
    .then((response) => response.text())
    .then((result) => {
      document.getElementById("output").innerText = result;
      if (result == "Success") {
        updateUserProgress(currentNum + 1);
      }
    })
    .catch((error) => {
      document.getElementById("output").innerText = "Error: " + error;
    });
});

function setLanguage(language) {
  view.destroy();
  initEditor(language);
  currentLanguage = language;
}

function getEditorValue() {
  return view.state.doc.toString();
}
initEditor(currentLanguage);

async function getProgress() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session.user.email; // Get email from session

  const { data, error } = await supabase
    .from("profiles")
    .select("progress_challenges")
    .eq("email", email);
  return data[0].progress_challenges;
}

async function updateUserProgress(number) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session.user.email; // Get email from session
  const { data, error } = await supabase
    .from("profiles")
    .update({ progress_challenges: number })
    .eq("email", email);

  if (error) {
    console.error("Error updating user progress:", error.message);
  } else {
    console.log("User progress updated successfully:", data);
    window.location.reload();
  }
}

async function loadQuestion(num) {
  const { data, error } = await supabase
    .from("Problems")
    .select("question")
    .eq("num", num);

  console.log(data);
  const quest = data[0].question;
  document.getElementById("pdfCanvas").innerText = quest;
}

async function openQuestion() {
  const num = await getProgress();

  const numbers = document.querySelectorAll(".number");
  numbers.forEach((number) => number.classList.remove("active"));

  // Activate the clicked number
  for (let index = 0; index < num; index++) {
    numbers[index].classList.add("active");
  }
}

export function showQuestion(questionNumber) {
  openQuestion();
  loadQuestion(questionNumber);
  currentNum = questionNumber;
}

// Initialize the first question as active
document.addEventListener("DOMContentLoaded", () => {
  showQuestion(1);
});

window.showQuestion = showQuestion;
