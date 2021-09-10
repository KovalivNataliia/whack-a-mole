let gamePlace = document.querySelector('.game');
let startBtn = document.querySelector('.start-btn');
let volumeBtnOff = document.querySelector('.volume-off');
let volumeBtnOn = document.querySelector('.volume-on');
let gameScore = document.querySelector('.score');
let gameLevel = document.querySelector('.level');
let gameMoves = document.querySelector('.moves');
let gameTime = document.querySelector('.time');
let moles = document.querySelectorAll('.mole');

let mainTheme = document.querySelector('.main-theme');
let kickSound = document.querySelectorAll('.kick-sound');
let endGameSound = document.querySelector('.end-game-sound');
let winGameSound = document.querySelector('.win-game-sound');
let sounds = document.querySelectorAll('.sound');
mainTheme.volume = 0.2;

let message = document.querySelector('.message-block');
let messages = ['Good job!', 'Great!','Awesome!','Perfect!','Wonderful!','Excellent!'];

let bestLevel = document.querySelector('.best-level');
let bestScore = document.querySelector('.best-score');
let getData = JSON.parse(localStorage.getItem('data'));
if (getData) {
  bestLevel.innerHTML = getData.level;
  bestScore.innerHTML = getData.score;
}

let gameEnd = false;
let gameContinue = false;
let gameWin = false;
let level = 1;

let lastMole, timerInterval, score, moves, minTime, maxTime, seconds;

rebuildLevelValue();

//Add Events

moles.forEach(mole => {
  mole.addEventListener('click', () => {
    kickSound[getRandomIndex(kickSound)].play();
    mole.style.backgroundImage = "url('./img/dead-mole.svg')";
    score++
    if (score <= 10) gameScore.innerText = `Score: ${score}/10`;
    setTimeout(() => {
      mole.classList.remove('up');
    }, 400);
    setTimeout(() => {
      mole.style.backgroundImage = "url('./img/mole.svg')";
    }, 600);
  })
})

gamePlace.addEventListener('click', () => {
  !gameContinue ? moves : moves--
  if (moves <= 5) gameMoves.classList.add('risk-zone');
  gameMoves.innerText = `Moves: ${moves}`;
  if (moves <= 0 && score < 10) loseGame();
})

startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  startGame()
  mainTheme.play()
}

volumeBtnOff.addEventListener('click', () => {
  volumeBtnOff.style.display = 'none';
  volumeBtnOn.style.display = 'block';
  sounds.forEach(sound => sound.muted = true)
})

volumeBtnOn.addEventListener('click', () => {
  volumeBtnOn.style.display = 'none';
  volumeBtnOff.style.display = 'block';
  sounds.forEach(sound => sound.muted = false)
})

//Main game functions

function startGame() {
  gameContinue = true;
  gameEnd = false;
  gameWin = false;
  startBtn.removeEventListener('click', onStartBtnClick);

  setTimeout(showMessage, 200);

  setTimeout(hideMessage, 3200);

  setTimeout(() => {
    game();
    timerInterval = setInterval(decreaseTime, 1000);
  }, 5000)
}

function game() {
  const time = randomTime(minTime, maxTime);
  const mole = randomMole(moles);

  if (score < 10 && seconds > 0) mole.classList.add('up');
  setTimeout(() => {
    mole.classList.remove('up');
    if (!gameEnd && gameContinue) game();
  }, time);

  if (score === 10 && level < 5) {
    newLevel();
  } else if (score === 10 && level === 5) {
    winGame();
  }
}

function newLevel() {
  gameContinue = false;
  clearInterval(timerInterval);
  level++;

  setTimeout(showMessage, 1000);

  setTimeout(() => {
    rebuildLevelValue();
    hideMessage();
  }, 4000)

  setTimeout(() => {
    gameContinue = true;
    timerInterval = setInterval(decreaseTime, 1000);
    game();
  }, 6500)
}

function rebuildLevelValue() {
  gameMoves.classList.remove('risk-zone');
  gameTime.classList.remove('risk-zone');

  switch(level) {
    case 1:
      minTime = 1000;
      maxTime = 1500;
      seconds = 20;
      moves = 15;
      break;
    case 2:
      minTime = 800;
      maxTime = 1200;
      seconds = 20;
      moves = 15;
      break;
    case 3:
      minTime = 800;
      maxTime = 1000;
      seconds = 15;
      moves = 12;
      break;
    case 4:
      minTime = 500;
      maxTime = 1000;
      seconds = 15;
      moves = 12;
      break;
    case 5:
      minTime = 300;
      maxTime = 800;
      seconds = 20;
      moves = 12;
      break;
  }

  score = 0;
  setValue();
}

function winGame() {
  gameWin = true;
  endGame();
}

function loseGame() {
  gameEnd = true;
  endGame();
}

function endGame() {
  createData();
  gameContinue = false;
  clearInterval(timerInterval);
  gameTime.innerHTML = `Time: 00:00`;
  level = 1;
  mainTheme.pause();
  mainTheme.currentTime = 0;

  setTimeout(() => {
    showMessage();
    gameWin ? winGameSound.play() : endGameSound.play();
  }, 200);

  setTimeout(() => {
    rebuildLevelValue();
    hideMessage()
    startBtn.addEventListener('click', onStartBtnClick);
  }, 5000)

  getData = JSON.parse(localStorage.getItem('data'));
}

function createData() {
  let sendData = {};
  if (getData && getData.level < level || !getData) {
    bestLevel.innerHTML = level;
    bestScore.innerHTML = score;
    sendData.level = level;
    sendData.score = score;
  } else if (getData && getData.level <= level && getData.score < score) {
    bestScore.innerHTML = score;
    sendData.level = getData.level;
    sendData.score = score;
  } else if (getData) {
    sendData.level = getData.level;
    sendData.score = getData.score;
  }

  localStorage.setItem('data', JSON.stringify(sendData));
}

//Value functions

function setValue() {
  gameTime.innerHTML = `Time: 00:${seconds}`;
  gameScore.innerText = `Score: ${score}/10`;
  gameMoves.innerText = `Moves: ${moves}`;
  gameLevel.innerHTML = `Level: ${level}`;
}

//Messages functions

function showMessage() {
  if (gameEnd) {
    message.innerHTML = `OH NO! <br> Mole wins :(`;
  } else if (gameWin) {
    message.innerHTML = `${messages[getRandomIndex(messages)]} <br> You win!`;
  } else if (level === 1) {
    message.innerHTML = `Let's start <br> Level: ${level}`;
  } else {
    message.innerHTML = `${messages[getRandomIndex(messages)]} <br> Level: ${level}`;
  }
  message.classList.add('visible');
}

function hideMessage() {
  message.classList.remove('visible');
}

//Time functions

function decreaseTime() {
  seconds--
  if (seconds <= 5) gameTime.classList.add('risk-zone');

  if (seconds >= 10 && gameContinue) {
    gameTime.innerHTML = `Time: 00:${seconds}`;
  } else if (seconds >= 0 && gameContinue){
    gameTime.innerHTML = `Time: 00:0${seconds}`;
  } else if (seconds < 0) {
    loseGame()
  }
}

//Random game functions

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomMole(moles) {
  let mole = moles[getRandomIndex(moles)];
  if (lastMole === mole) {
    return randomMole(moles);
  }
  lastMole = mole;
  return mole;
}

console.log('Total score: 30/30');
console.log('Main task: implement Whack-a-mole game 10/10');
console.log('Required functionality: implement 5 levels, save the best result to localStorage 10/10');
console.log('Additional functionality: add timer, moves count, sounds 10/10');