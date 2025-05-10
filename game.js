const gamebox = document.querySelector('.gamebox');
const gameboxWidth = parseFloat(getComputedStyle(gamebox).width);
const gameboxHeight = parseFloat(getComputedStyle(gamebox).height);
const player = document.querySelector('.player');
const playerWidth = parseFloat(getComputedStyle(player).width); 
const playerHeight = parseFloat(getComputedStyle(player).height); 
let playerPosition = gameboxWidth / 2;
const scale = 2.5;
const moveSpeed = 9;
let isFacingRight = true;
let colourID;
let playerWorldX = 500; // Starting position in the world
let playerScreenX = gameboxWidth / 2; // Center of screen
const handcam = document.querySelector('.hand-cam');

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
};

// start running
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        player.classList.add('running');
    }
    console.log("Keys:", keys);
    console.log("World X:", playerWorldX);
});

// end running
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
        if (!keys.ArrowLeft && !keys.ArrowRight) {
            player.classList.remove('running');
        }
    }
});

function gameLoop() {
    // player movement left and right
    if (keys.ArrowLeft) {
        playerWorldX = Math.max(playerWidth * scale / 2, playerWorldX - moveSpeed);
        if (isFacingRight) {
            player.style.transform = 'translateX(-50%) scaleX(-2.5) scaleY(2.5)';
            isFacingRight = false;
        }
    } 
    else if (keys.ArrowRight) {
        playerWorldX = Math.min(2000 - (playerWidth * scale / 2), playerWorldX + moveSpeed);
        if (!isFacingRight) {
            player.style.transform = 'translateX(-50%) scaleX(2.5) scaleY(2.5)';
            isFacingRight = true;
        }
    }

    // Update player screen position
    player.style.left = `${playerWorldX}px`;

    // Update camera
    const cameraX = playerWorldX - (gameboxWidth / 2);
    const clampedX = Math.max(0, Math.min(cameraX, 2000 - gameboxWidth));
    document.querySelector('.world-container').style.transform = `translateX(-${clampedX}px)`;
    
    requestAnimationFrame(gameLoop);
}

player.style.left = `${playerPosition}px`;
gameLoop();
