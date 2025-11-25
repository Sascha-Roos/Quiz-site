const QUIZZES = [
  {
    id: 'numbers',
    title: 'Learning numbers',
    questions: [
      { q: '🍎🍎🍎', choices: ['3', '4', '5'], correct: 0 },
      { q: '🐈🐈🐈🐈🐈', choices: ['2', '5', '9'], correct: 1 },
      { q: '❤️❤️', choices: ['1', '2', '3'], correct: 1 }
    ]
  },
  {
    id: 'science',
    title: 'Tiny Science Quiz',
    questions: [
      { q: 'Water freezes at what temperature (°C)?', choices: ['0', '100', '-10'], correct: 0 },
      { q: 'The planet closest to the sun?', choices: ['Venus', 'Mars', 'Mercury'], correct: 2 }
    ]
  }
];

/* ---------- DOM refs ---------- */
const quizSelect = document.getElementById('quiz-select');
const quizzesContainer = document.getElementById('quizzes');
const playScreen = document.getElementById('quiz-play');
const resultScreen = document.getElementById('result-screen');
const quizTitle = document.getElementById('quiz-title');
const questionText = document.getElementById('question-text');
const qIndexSpan = document.getElementById('qIndex');
const qTotalSpan = document.getElementById('qTotal');
const answerBtns = Array.from(document.querySelectorAll('.answer-btn'));
const nextBtn = document.getElementById('next-btn');
const quitBtn = document.getElementById('quit-btn');
const restartBtn = document.getElementById('restart-btn');
const resultText = document.getElementById('result-text');

const body = document.querySelector("body");
body.style.background = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;


/* ---------- App state ---------- */
let currentQuiz = null;
let currentIndex = 0;
let score = 0;
let answered = false;

/* ---------- Helpers ---------- */
function show(element) {
  element.classList.remove('hidden');
}
function hide(element) {
  element.classList.add('hidden');
}
function clearAnswers() {
  answerBtns.forEach(b => {
    b.disabled = false;
    b.classList.remove('correct', 'wrong');
  });
}

/* ---------- Build quiz selection UI ---------- */
function renderQuizList() {
  quizzesContainer.innerHTML = '';
  QUIZZES.forEach(q => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = `<h3>${q.title}</h3><p>${q.questions.length} questions</p>`;
    card.addEventListener('click', () => startQuiz(q.id));
    quizzesContainer.appendChild(card);
  });
}

/* ---------- Start a quiz ---------- */
function startQuiz(quizId) {
  currentQuiz = QUIZZES.find(q => q.id === quizId);
  currentIndex = 0;
  score = 0;
  answered = false;

  quizTitle.textContent = currentQuiz.title;
  qTotalSpan.textContent = currentQuiz.questions.length;
  qIndexSpan.textContent = currentIndex + 1;

  hide(quizSelect);
  hide(resultScreen);
  show(playScreen);

  renderQuestion();
}

/* ---------- Render the question ---------- */
function renderQuestion() {
  clearAnswers();
  const q = currentQuiz.questions[currentIndex];
  questionText.textContent = q.q;
  answerBtns.forEach((btn, idx) => {
    btn.textContent = q.choices[idx];
    btn.dataset.index = idx;
  });
  answered = false;
  hide(nextBtn);
}

/* ---------- Handle answer click ---------- */
answerBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (answered) return;
    answered = true;
    const chosen = Number(e.currentTarget.dataset.index);
    const correct = currentQuiz.questions[currentIndex].correct;

    // mark UI
    answerBtns.forEach(b => b.disabled = true);
    if (chosen === correct) {
      e.currentTarget.classList.add('correct');
      score++;
    } else {
      e.currentTarget.classList.add('wrong');
      // highlight correct answer
      const correctBtn = answerBtns.find(b => Number(b.dataset.index) === correct);
      if (correctBtn) correctBtn.classList.add('correct');
    }

    // if there are more questions, show next button else show result
    if (currentIndex < currentQuiz.questions.length - 1) {
      show(nextBtn);
    } else {
      // last question, show result button (we reuse next for simplicity)
      nextBtn.textContent = 'See results';
      show(nextBtn);
    }
  });
});

/* ---------- Next question or finish ---------- */
nextBtn.addEventListener('click', () => {
  if (currentIndex < currentQuiz.questions.length - 1) {
    currentIndex++;
    qIndexSpan.textContent = currentIndex + 1;
    renderQuestion();
    nextBtn.textContent = 'Next question';
  } else {
    showResult();
  }
});

/* ---------- Quit / Restart ---------- */
quitBtn.addEventListener('click', () => {
  // go back to selection
  show(quizSelect);
  hide(playScreen);
  hide(resultScreen);
});

restartBtn.addEventListener('click', () => {
  show(quizSelect);
  hide(playScreen);
  hide(resultScreen);
});

/* ---------- Results ---------- */
function showResult() {
  hide(playScreen);
  show(resultScreen);
  resultText.textContent = `You scored ${score} out of ${currentQuiz.questions.length}.`;
}

/* ---------- Init ---------- */
renderQuizList();