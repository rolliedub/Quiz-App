//question
const _q = document.getElementById('question');
//option
const _opt = document.querySelector('.quiz-options');
//check button
const _CB = document.getElementById('check-answer');
//skip button
const _SB = document.getElementById('skip-button');
//check score
const _CS = document.getElementById('correct-score');
//total number of question
const _TQ = document.getElementById('total-question');
//play again button
const _PAB = document.getElementById('play-again');
//result
const _result = document.getElementById('result');

var question = {};
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 5;
var curr = 0;
//for timer
let timer;
// Load question from API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=10';
    const result = await fetch(`${APIUrl}`)
    question = await result.json();
    _result.innerHTML = "";
    showQuestion(question.results[0]);
    curr=0;
}
// Event Listener
function eventListeners(){
    _CB.addEventListener('click', checkAnswer);
    _PAB.addEventListener('click', restartQuiz);
    _SB.addEventListener('click', skip);
}
document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _TQ.textContent = totalQuestion;
    _CS.textContent = correctScore;
});
//Displaying Question
function showQuestion(data){
    _CB.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _q.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _opt.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    // Timer
    const tm = document.getElementById('timer_sec');
    let sec = 60;
         timer = setInterval(() => {
            tm.innerText = sec;
            sec--;
                if(sec===-1){
                clearInterval(timer);
                curr++;
                showQuestion(question.results[curr]);
                }
        },1000)
    selectOption();
}
// Selecting the option
function selectOption(){
    _opt.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_opt.querySelector('.selected')){
                const activeOption = _opt.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}
// Check Answer
function checkAnswer(){

    // document.getElementById('op').addEventListener('click', (e)=>{
    //      e.style.backgroundColor='green'
    // })

    _CB.disabled = true;
    if(timer)
        clearInterval(timer); 
    if(_opt.querySelector('.selected')){
        let selectedAnswer = _opt.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _CB.disabled = false;
    }
    list();
}
//skip button
function skip(){
    if(timer)
        clearInterval(timer);
        const tm = document.getElementById('timer_sec');
        let sec = 0;
             timer = setInterval(() => {
                tm.innerText = sec;
                sec--;
                    if(sec===-1){
                    clearInterval(timer);
                    curr++;
                    showQuestion(question.results[curr]);
                    }
            },1000)
        selectOption();
}
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
// Count Correct Answer
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _PAB.style.display = "block";
        _CB.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}
// set count
function setCount(){
    _TQ.textContent = totalQuestion;
    _CS.textContent = correctScore;
}
//list
function list(){

    if(correctScore==1){
        document. getElementById('box0'). style. backgroundColor = 'green';
    }
    else if(correctScore==2){
        document. getElementById('box1'). style. backgroundColor = 'green';
    }
    else if(correctScore==3){
        document. getElementById('box2'). style. backgroundColor = 'green';
    }
    else if(correctScore==4){
        document. getElementById('box3'). style. backgroundColor = 'green';
    }
    else if(correctScore==5){
        document. getElementById('box4'). style. backgroundColor = 'green';
    }

}
//show result
function restartQuiz(){
    correctScore = askedCount = 0;
    _PAB.style.display = "none";
    _CB.style.display = "block";
    _CB.disabled = false;
    setCount();
    loadQuestion();
}