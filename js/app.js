let score = 0;
let problemNumber = 0;
let correctAnswer;
let questionData;

const problemDiv = document.querySelector('.displayQuestion');
const answerUL = document.querySelector('#answers ul');
answerUL.addEventListener('click', handleAnswer);
const answerLIs = document.querySelectorAll('#answers li');
answerLIs.forEach(li => {
    li.addEventListener('click', showCorrectAnswer)
});
const currentScore = document.querySelector('.currentScore');
const currentProblem = document.querySelector('.currentProblem');
const btnStartOver = document.getElementById('btnStartOver');
btnStartOver.addEventListener('click', startOver);
const elementsToHide = document.querySelectorAll('.show-hide');

function shuffleArray(arr) {
    return arr.sort(function (a, b) { return Math.random() - 0.5 })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getQuestionData() {
    const api_url = 'https://opentdb.com/api.php?amount=10&category=9&type=multiple';

    try {
        fetch(api_url)
        .then(response => response.json())
        .then(data => {
            questionData = data.results;
            askQuestion(problemNumber);
        });

    } catch (error) {
        console.log(error);
    }
}

function askQuestion(problemNumber) {
    currentProblem.innerText = problemNumber + 1;
    let q = questionData[problemNumber];
    let currentQuestion = q.question;
    problemDiv.innerHTML = currentQuestion;

    answers = [...q.incorrect_answers]
    correctAnswer = q.correct_answer;
    answers.push(q.correct_answer);
    answers = shuffleArray(answers);

    for (let i = 0; i < answerLIs.length; i++) {
        answerLIs[i].innerHTML = answers[i];
    }
}

function handleAnswer(e) {
    if (e.target.innerText === correctAnswer) {
        score++;
    }

    currentScore.innerText = score;

    sleep(1500).then(() => {
        
        answerLIs.forEach(li => {
            if (li.classList.contains('highlight')) {
                li.classList.remove('highlight');
            }

            if (li.classList.contains('wrong')) {
                li.classList.remove('wrong');
            }
        })
    
        if (problemNumber < 9) {
            problemNumber++;
            askQuestion(problemNumber);
        }
        else {
            endQuiz();
        }
    })
}

function showCorrectAnswer(e) {
    if (e.target.innerText !== correctAnswer) {
        e.target.classList.add('wrong');
    }

    answerLIs.forEach((answer) => {
        if (answer.innerText === correctAnswer) {
            answer.classList.add('highlight');
        }
    })
}

function startOver() {
    getQuestionData();
    problemNumber = 0;
    currentProblem.innerText = problemNumber + 1;
    score = 0;
    currentScore.innerText = score;

    elementsToHide.forEach((element) => {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
        }
    })

    askQuestion(problemNumber);
}

function endQuiz() {
    currentScore.innerText = score;
    elementsToHide.forEach((element) => {
        element.classList.add('hidden');
    })
}

document.addEventListener('DOMContentLoaded', () => {
    getQuestionData();
})