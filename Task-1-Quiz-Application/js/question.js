
const questions = [
  { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], answer: "8" },
  { question: "What is 10 - 4?", options: ["5", "6", "7", "8"], answer: "6" },
  {
    question: "What is 7 x 2?",
    options: ["12", "14", "16", "18"],
    answer: "14",
  },
  { question: "What is 16 ÷ 4?", options: ["2", "3", "4", "5"], answer: "4" },
  {
    question: "What is 12 + 15?",
    options: ["25", "26", "27", "28"],
    answer: "27",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars",
  },
  {
    question: "Who is the captain of ICT'?",
    options: ["Dhoni", "Rohit", "Kohli", "Sachin"],
    answer: "Rohit",
  },
  {
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Paris", "Lisbon"],
    answer: "Delhi",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "What is the boiling point of water?",
    options: ["90°C", "100°C", "120°C", "110°C"],
    answer: "100°C",
  },
];

localStorage.setItem("questions", JSON.stringify(questions));



const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");
const pointerElement = document.getElementById("current-progress-pointer");
const progressBarMilestones = document.querySelectorAll(".milestone");
const popup = document.getElementById("popup");
const popupNextButton = document.getElementById("popup-next-button");
const timeElement = document.querySelector("#time");
const clockElement = document.querySelector(".clock");

let currentQuestion = 0;
let score = 0;
let timer;
const duration = 30;
let answers = [];

const startTimer = () => {
  let timeRemaining = duration;

  clearInterval(timer);

  timer = setInterval(() => {
    timeElement.textContent = `${timeRemaining}s`;

    const percentage = (timeRemaining / duration) * 100;

    clockElement.style.background = `conic-gradient(
      #3498db ${percentage}%, 
      #ddd ${percentage}%
    )`;

    timeRemaining--;

    if (timeRemaining < 0) {
      clearInterval(timer);
      if (currentQuestion !== questions.length - 1) {
        showPopup();
      } else {
        submitQuiz();
      }

    }
  }, 1000);
};

const showPopup = () => {
  popup.style.display = "block";
};



function initializeProgress() {
  progressBar.style.width = "0%";
  pointerElement.style.left = "0";
}

let pointerPosition = 0;

function updateProgress(isCorrect) {
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  console.log(progressPercentage);

  progressBar.style.width = `${progressPercentage}%`;


  pointerPosition += 87.4;

  // console.log(pointerPosition);

  pointerElement.style.left = `${pointerPosition}px`;

  if (isCorrect !== undefined) {
    progressBarMilestones[currentQuestion].classList.add(
      isCorrect ? "correct" : "wrong"
    );
  }
}

function loadQuestion() {
  const questionData = questions[currentQuestion];
  questionElement.textContent = questionData.question;
  optionsContainer.innerHTML = "";

  questionData.options.forEach((option) => {
    const optionElement = document.createElement("div");  
    optionElement.classList.add("option");
    optionElement.textContent = option;
    optionElement.addEventListener("click", () => {
      document
        .querySelectorAll(".option")
        .forEach((el) => el.classList.remove("selected"));
      optionElement.classList.add("selected");
      optionSelected();
    });
    optionsContainer.appendChild(optionElement);
  });

  startTimer();
}

const optionSelected = () => {
  const selectedOption = document.querySelector(".option.selected");
  if (selectedOption) {
    nextButton.disabled = false;
    nextButton.style.cursor = "pointer";
    submitButton.disabled = false;
    submitButton.style.cursor = "pointer";
  }
};

function nextQuestion() {
  const selectedOption = document.querySelector(".option.selected");

  clearInterval(timer);
  // console.log(selectedOption);

  const isCorrect =
    selectedOption &&
    selectedOption.textContent === questions[currentQuestion].answer;

  if (selectedOption) {
    answers.push(selectedOption.innerHTML);
  } else {
    answers.push("No answer");
  }

  console.log(answers);
  if (isCorrect) {
    score++;
  }

  updateProgress(isCorrect);

  currentQuestion++;
  // console.log(currentQuestion);
  if (currentQuestion < questions.length) {
    loadQuestion();
  }
  if (currentQuestion === questions.length - 1) {
    submitButton.classList.remove("hidden");
    nextButton.classList.add("hidden");
  }
  popup.style.display = "none";
  nextButton.disabled = true;
  submitButton.disabled = true;
  submitButton.style.cursor = "not-allowed";
  nextButton.style.cursor = "not-allowed";
}

function submitQuiz() {
  nextQuestion();
  setTimeout(() => {
    localStorage.setItem("quizScore", score);
    localStorage.setItem("userAnswers", JSON.stringify(answers));
    window.location.href = "result.html";
  }, 2000);
}

if (currentQuestion < questions.length - 1) {
  // console.log(currentQuestion);
  // console.log(questions.length);
  nextButton.addEventListener("click", nextQuestion);
}

submitButton.addEventListener("click", submitQuiz);
popupNextButton.addEventListener("click", nextQuestion);

document.addEventListener("DOMContentLoaded", () => {
  initializeProgress();
  loadQuestion();
});
