const GAME_SECONDS = 10;
const RANKING_KEY = "click-game-ranking";

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const endScreen = document.querySelector("#end-screen");
const startForm = document.querySelector("#start-form");
const playerNameInput = document.querySelector("#player-name");
const timerElement = document.querySelector("#timer");
const clickCountElement = document.querySelector("#click-count");
const clickButton = document.querySelector("#click-button");
const finalScore = document.querySelector("#final-score");
const rankingList = document.querySelector("#ranking-list");
const playAgainButton = document.querySelector("#play-again");

let playerName = "";
let clicks = 0;
let secondsLeft = GAME_SECONDS;
let timerId = null;

startForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = playerNameInput.value.trim();
  if (!name) {
    playerNameInput.focus();
    return;
  }

  playerName = name;
  startGame();
});

clickButton.addEventListener("click", () => {
  clicks += 1;
  clickCountElement.textContent = clicks;
});

playAgainButton.addEventListener("click", () => {
  clicks = 0;
  secondsLeft = GAME_SECONDS;
  playerNameInput.value = "";
  showScreen(startScreen);
  playerNameInput.focus();
});

function startGame() {
  clicks = 0;
  secondsLeft = GAME_SECONDS;
  clickCountElement.textContent = "0";
  timerElement.textContent = formatTime(secondsLeft);
  showScreen(gameScreen);

  clearInterval(timerId);
  timerId = setInterval(() => {
    secondsLeft -= 1;
    timerElement.textContent = formatTime(secondsLeft);

    if (secondsLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function finishGame() {
  clearInterval(timerId);
  timerId = null;

  saveScore(playerName, clicks);
  finalScore.textContent = `${playerName}, has hecho ${clicks} clicks.`;
  renderRanking();
  showScreen(endScreen);
}

function showScreen(screenToShow) {
  [startScreen, gameScreen, endScreen].forEach((screen) => {
    screen.classList.toggle("hidden", screen !== screenToShow);
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getRanking() {
  const savedRanking = localStorage.getItem(RANKING_KEY);
  return savedRanking ? JSON.parse(savedRanking) : [];
}

function saveScore(name, score) {
  const ranking = getRanking();
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking.slice(0, 10)));
}

function renderRanking() {
  const ranking = getRanking();
  rankingList.innerHTML = "";

  if (ranking.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "ranking-empty";
    emptyMessage.textContent = "Todavía no hay puntuaciones.";
    rankingList.after(emptyMessage);
    return;
  }

  ranking.forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${escapeHtml(entry.name)}</span><span class="score">${entry.score}</span>`;
    rankingList.appendChild(item);
  });
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}
