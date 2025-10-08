const subjectItems = document.querySelectorAll('.subject-item');
const questionText = document.querySelector('.question-text');
const startMenu = document.getElementById('start-menu');
const questionMenu = document.getElementById('question-menu');
const scoreMenu = document.getElementById('score-menu');
const optionItems = document.querySelectorAll('.option-item');
const submitBtn = document.querySelector('.submit');
const nextBtn = document.querySelector('.next');
const errorMessageContainer = document.querySelector('.error-message');
const playAgainBtn = document.querySelector('.play-again');
const progressBar = document.querySelector('.progress-bar');
const darkInput = document.querySelector('.dark-input');
const scoreText = document.querySelector('.score');
const number = document.querySelector('.number');
const subjectTitle = document.querySelectorAll('.subject-title');

//-------------------
// State variables :
//-------------------

let quizData = null;
let currentQuestionIndex = 0;
let score = 0;
let currentSubject = null;


//--------------------
// Questions fetching
//--------------------
async function loadQuizData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    quizData = data.quizzes;
    console.log("Quiz data loaded:", quizData);
  } catch (error) {
    console.error("Error loading quiz data:", error);
  }
}

loadQuizData();

//-------------
// FUNCTIONS :
//-------------

//Find quiz subject 

const findQuizBySubject = (subject) => {
  if(!quizData) return "Quiz data not loaded yet";
  const quiz = quizData.find((quiz) => quiz.title.toLowerCase() === subject.textContent.toLowerCase());
  return quiz;
}

//Display quiz page

const displayQuiz = () => {
  startMenu.classList.add('hidden');
  questionMenu.classList.remove('hidden');
}

//Update header

const updateHeader = (subject) => {
  const subjectIcon = document.querySelectorAll('.subject-icon');
 

  subjectIcon.forEach((icon) => {
    icon.src= subject.icon;
    icon.classList.add(subject.title.toLowerCase());
  } );

  subjectTitle.forEach((title) => {
    title.textContent = subject.title;
  });

}
//Display question number
const questionNumber = () => {
  number.textContent = currentQuestionIndex + 1;
  progressBar.style.width = ((currentQuestionIndex + 1) * 10 -3) +"%" 
}

//Display questions 

const updateQuestion = (subject) => {
  questionText.textContent = subject.questions[currentQuestionIndex].question;
}

//Display Options 
const updateOptions = (subject) => {
  const optionItems = document.querySelectorAll('.option');
  const options = subject.questions[currentQuestionIndex].options
  optionItems.forEach((optionItem, index) => {
    optionItem.textContent = options[index];
  });
}

//Answer reset 
const answerReset = () => {
  optionItems.forEach((option) => {
    const letter = option.querySelector('.letter');
    const correctImage = option.querySelector('.correct-image');
    const errorImage = option.querySelector('.error-image');
    option.classList.remove('correct', 'error', 'clicked', 'no-clickable');
    letter.classList.remove('correct', 'error', 'clicked');
    correctImage.classList.add('hidden');
    errorImage.classList.add('hidden');
  })}

//Answer reveal 

const answerReveal = (subject) => {
  errorMessageContainer.classList.add('hidden');
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');

  const answer = subject.questions[currentQuestionIndex].answer;
  optionItems.forEach((option) => {
    option.classList.add('no-clickable');
    const optionText = option.querySelector('.option').textContent.trim();
    const letter = option.querySelector('.letter');
    const correctImage = option.querySelector('.correct-image');
    const errorImage = option.querySelector('.error-image');


    if(optionText === answer) {
      correctImage.classList.remove('hidden');
    }
    if (option.classList.contains('clicked')) {
      if (optionText === answer) {
        option.classList.add('correct');
        letter.classList.add('correct');
        errorImage.classList.add('hidden');
        score ++;
      } else {
        option.classList.add('error');
        letter.classList.add('error');
        errorImage.classList.remove('hidden');
      } 
    }
  });
}

//Error Message 
 
const errorMessage = () => {
   const selectedOption = Array.from(optionItems).find(option => option.classList.contains('clicked'));
   if(!selectedOption) {
    errorMessageContainer.classList.remove('hidden');
   } else answerReveal(currentSubject);
}

//Question Update

const nextQuestion = () => {
  currentQuestionIndex ++;
  updateQuestion(currentSubject);
  questionNumber();
  updateOptions(currentSubject);
  answerReset();
  nextBtn.classList.add('hidden');
  submitBtn.classList.remove('hidden');
}

//Display score 

const displayScore = () => {
  scoreMenu.classList.remove('hidden');
  questionMenu.classList.add('hidden');
  scoreText.textContent = score;
}

//Quiz Reset 

const resetQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  currentSubject = null;
  progressBar.style.width = "0%";

  answerReset();
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');

  errorMessageContainer.classList.add('hidden');

  questionText.textContent = "";

  scoreMenu.classList.add('hidden');
  startMenu.classList.remove('hidden');
}

//Dark Mode

const darkMode = () => {

  const titleContainer = document.querySelectorAll('.title-container');
  const description = document.querySelector('.description');
  const body = document.body
  const scoreOver = document.querySelector('.score-over');
  const optionItems = document.querySelectorAll('.option-item');
  const progressBarContainer = document.querySelector('.progress-bar-container');
  const sunIcons = document.querySelectorAll('.sun-icon');
  const darkIcons = document.querySelectorAll('.dark-icon'); 
  const scoreContainer = document.querySelector('.score-container');

  titleContainer.forEach(title => title.classList.toggle('dark'));
  subjectTitle.forEach(title => title.classList.toggle('dark'));
  description.classList.toggle('dark');
  body.classList.toggle('dark');
  scoreOver.classList.toggle('dark');
  progressBarContainer.classList.toggle('dark');
  scoreText.classList.toggle('dark');
  number.classList.toggle('dark');
  optionItems.forEach(item => item.classList.toggle('dark'));
  subjectItems.forEach(item => item.classList.toggle('dark'));
  questionText.classList.toggle('dark');
  scoreContainer.classList.toggle('dark');
  sunIcons.forEach(sun => sun.classList.toggle('hidden'));
  darkIcons.forEach(dark => dark.classList.toggle('hidden'));

}

//------------
//LISTENERS :
//------------

//Click on the subject button to display quiz page

subjectItems.forEach((subject)=> {
  subject.addEventListener('click', () => {
    const subjectName = subject.textContent;
    const selectSubject = quizData.find(q => q.title.toLowerCase() === subjectName.toLocaleLowerCase());
    if(selectSubject) {
      currentSubject = selectSubject;
      console.log(currentSubject);
      displayQuiz();
      updateHeader(currentSubject);
      updateQuestion(currentSubject);
      updateOptions(currentSubject);
      questionNumber();
    }
  });
});

//Option clicked function

optionItems.forEach((option) => {
  option.addEventListener('click', () => {
     const letter = option.querySelector('.letter');
    optionItems.forEach(opt => {
      opt.classList.remove('clicked');
      const optLetter = opt.querySelector('.letter');
      if (optLetter) optLetter.classList.remove('clicked');
    });
    option.classList.add('clicked');
    letter.classList.add('clicked');
  });
});

//Answer Submit 

submitBtn.addEventListener('click', () => {
  errorMessage();
});

//Next question
nextBtn.addEventListener('click', () => {
  console.log(score);
  if(currentQuestionIndex + 1 < currentSubject.questions.length) {
    nextQuestion();
  } else {
    displayScore();
  }
} );

playAgainBtn.addEventListener('click', resetQuiz);

//Dark Mode

darkInput.addEventListener('input', darkMode);