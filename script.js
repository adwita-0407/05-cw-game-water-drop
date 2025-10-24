// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
//Score changing
let timerInterval;
let timeLeft = 30; // Game duration in seconds
let score = 0;


// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  // reset score and time when starting a new game
  score = 0;
  document.getElementById("score").innerText = score;
  timeLeft = 30;
  document.getElementById("time").innerText = timeLeft;

  dropMaker = setInterval(createDrop, 1000);
  // start the countdown timer (decrements every second)
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      endGame('time');
    }
  }, 1000);
}


function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Randomly mark some drops as "bad" (20% chance)
  const isBad = Math.random() < 0.2;
  if (isBad) {
    drop.classList.add('bad-drop');
    drop.dataset.bad = 'true';
  }

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    if (!drop.dataset.clicked) drop.remove();
  });

  // Increase score and remove the drop when clicked (only once)
  drop.addEventListener("click", () => {
    if (drop.dataset.clicked) return; // Prevent multiple clicks on the same drop
    drop.dataset.clicked = "true";
    // Deduct for bad drops, add for good drops
    if (drop.dataset.bad) {
      score = Math.max(0, score - 1); // don't let score go below 0
    } else {
      score += 1;
    }
    // Update only the numeric value inside the score span
    document.getElementById("score").innerText = score;
    drop.remove();
  });
}

function endGame(reason = 'time') {
  // Stop the intervals and mark the game as not running
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  // Remove all remaining drops from the screen
  const container = document.getElementById('game-container');
  container.querySelectorAll('.water-drop').forEach(d => d.remove());

  // Optionally show why the game ended to the player
  const reasonText = reason === 'score' ? 'score target reached' : 'time is up';
  alert(`Game over (${reasonText})! Final score: ${score}`);
}