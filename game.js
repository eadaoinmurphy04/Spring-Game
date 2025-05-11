const gamebox = document.querySelector('.gamebox');
const gameboxWidth = parseFloat(getComputedStyle(gamebox).width);
const gameboxHeight = parseFloat(getComputedStyle(gamebox).height);
const player = document.querySelector('.player');
const playerWidth = parseFloat(getComputedStyle(player).width); 
const playerHeight = parseFloat(getComputedStyle(player).height); 
let playerPosition = gameboxWidth / 2;
const scale = 2.5;
const moveSpeed = 7;
let isFacingRight = true;
let colourID;
let playerWorldX = 500; // Starting player position in the world
let playerScreenX = gameboxWidth / 2; // begin screen position in the middle
let pause = false;
const handcam = document.querySelector('.hand-cam');
const animal = document.querySelector('.animal');

// squirrel movement values
// squirrel sprite by https://elthen.itch.io/
let squirrel = document.querySelector('.squirrel');
let squirrelX = 600; // Starting position X
let squirrelDirection = 1; // 1 for right, -1 for left
const squirrelSpeed = 5;
const squirrelMinX = 600; // Left movement boundary
const squirrelMaxX = 1400; // Right movement boundary

// bird movement values
// bird sprite by https://ma9ici4n.itch.io/
let bird = document.querySelector('.bird');
let birdX = 300; // Starting position X
let birdDirection = 1; // 1 for right, -1 for left
const birdSpeed = 7;
const birdMinX = 100; // Left movement boundary
const birdMaxX = 1800; // Right movement boundary
bird.style.transform = 'scaleX(-1) scaleY(1) scale(2)'; // Start facing right

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

// click event for opening and closing the album
let album_icon = document.querySelector('.album-icon');
let album = document.querySelector('.album');
album_icon.addEventListener('click', function() {    
    if (!pause){ // open the album and pause the game
        document.body.classList.add('album-visible');
        pause = true;
    }
    else{ // close the album and resume the game
        document.body.classList.remove('album-visible');
        pause = false;
    }
});

// click event for each animal
document.querySelectorAll('.animal').forEach(animal => {
    // camera clicks
    
    // animal logged as photographed
    animal.addEventListener('click', function() {
        if (this.classList.contains('squirrel')) {
            console.log("Squirrel clicked");
        } 
        else if (this.classList.contains('bird')) {
            console.log("Bird clicked");
        }
    });
});

function gameLoop() {
if (!pause)
{
    // player movement left and right
    // bunny player sprite by https://toffeecraft.itch.io/
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
    
    // squirrel movement
        squirrelX += squirrelSpeed * squirrelDirection;
    // change sprite direction    
    if (squirrelX >= squirrelMaxX) {
        squirrelDirection = -1; // Move left
        squirrel.style.transform = 'scaleX(-2) scaleY(2)'; // Flip sprite
    } else if (squirrelX <= squirrelMinX) {
        squirrelDirection = 1; // Move right
        squirrel.style.transform = 'scaleX(2) scaleY(2)';
    }
    squirrel.style.left = `${squirrelX}px`;

    // manage bird movement
    birdX += birdSpeed * birdDirection;
    if (birdX >= birdMaxX) {
        birdDirection = -1; // Move left
        bird.style.transform = 'scaleX(1) scaleY(1) scale(2)'; // Normal (left-facing)
    } 
    else if (birdX <= birdMinX) {
        birdDirection = 1; // Move right
        bird.style.transform = 'scaleX(-1) scaleY(1) scale(2)'; // Flipped (right-facing)
    }
    bird.style.left = `${birdX}px`;
}

requestAnimationFrame(gameLoop);
}

player.style.left = `${playerPosition}px`;
gameLoop();
