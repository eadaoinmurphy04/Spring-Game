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
const birdSpeed = 9;
const birdMinX = 100; // Left movement boundary
const birdMaxX = 1800; // Right movement boundary
bird.style.transform = 'scaleX(-1) scaleY(1) scale(2)'; // Start facing right

// deer movement values
// deer sprite by https://broynsa.itch.io/
let deer = document.querySelector('.deer');
let deerX = 1200; // Starting position X
let deerDirection = 1; // 1 for right, -1 for left
const deerSpeed = 7;
const deerMinX = 800; // Left movement boundary
const deerMaxX = 1900; // Right movement boundary
let deerIsSitting = false;
let nextSitTimeout;
deer.style.transform = 'scaleX(-1) scaleY(1) scale(3)'; // Start facing right

// dog movement values
// dog sprite by https://broynsa.itch.io/
let dog = document.querySelector('.dog');
let dogX = -400; // Starting position X
let dogDirection = 1; // 1 for right, -1 for left
const dogSpeed = 6;
const dogMinX = -600; // Left movement boundary
const dogMaxX = 200; // Right movement boundary
let dogIsSitting = false;

// controls background music
const backgroundMusic = new Audio('Sound/relaxing-birds-and-piano-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
function startMusicOnce() {
    backgroundMusic.play();
    document.removeEventListener('click', startMusicOnce);
    document.removeEventListener('keydown', startMusicOnce);
}
document.addEventListener('click', startMusicOnce);
document.addEventListener('keydown', startMusicOnce);

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
};

// start player running
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        player.classList.add('running');
    }
    console.log("Keys:", keys);
    console.log("World X:", playerWorldX);
});

// end player running
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
    // animal logged as photographed
    animal.addEventListener('click', function () {
        if (pause) return;

        // camera clicks
        const shutterSound = new Audio('Sound/camera-shutter.mp3');
        shutterSound.currentTime = 0;
        shutterSound.play();

        let animalType = "";
        if (this.classList.contains('squirrel')) animalType = "squirrel";
        else if (this.classList.contains('bird')) animalType = "bird";
        else if (this.classList.contains('deer')) animalType = "deer";
        else if (this.classList.contains('dog')) animalType = "dog";
        const nameLabel = document.querySelector(`.${animalType}-icon .name`);
        if (nameLabel) {
            nameLabel.classList.add('found');
        }
    });
});

// schedules when the deer will randomly sit down
function scheduleDeerSit() {
    const timeUntilSit = Math.random() * 5000 + 3000; // 3–8 seconds
    nextSitTimeout = setTimeout(() => {
        deer.classList.add('sit');
        deerIsSitting = true;

        const sitDuration = Math.random() * 3000 + 2000; // Sit for 2–5 seconds
        setTimeout(() => {
            deer.classList.remove('sit');
            deerIsSitting = false;
            scheduleDeerSit(); // Schedule the next sit
        }, sitDuration);
    }, timeUntilSit);
}
scheduleDeerSit();

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
    
    // manage squirrel movement
    squirrelX += squirrelSpeed * squirrelDirection;
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
    
    // manage deer movement
    if (!deerIsSitting) {
        deerX += deerSpeed * deerDirection;
        if (deerX >= deerMaxX) {
            deerDirection = -1; // Move left
            deer.style.transform = 'scaleX(1) scaleY(1) scale(3)'; // Normal (left-facing)
        } else if (deerX <= deerMinX) {
            deerDirection = 1; // Move right
            deer.style.transform = 'scaleX(-1) scaleY(1) scale(3)'; // Flipped (right-facing)
        }
        deer.style.left = `${deerX}px`;
    }

// In your game loop's dog movement section:
if (!dogIsSitting) {
    dogX += dogSpeed * dogDirection;
    
    if (dogX >= dogMaxX) {
        dogDirection = -1; // Face left
        dog.style.transform = 'scaleX(-2) scaleY(2) scale(1.5)';
        
        // Start sitting
        dog.classList.add('sit');
        dog.style.transform = 'scaleX(2) scaleY(2) scale(1.5)';
        dogIsSitting = true;
        
        
        // Stand up after 3 seconds
        setTimeout(() => {
            dog.classList.remove('sit');
            dog.style.transform = 'scaleX(-2) scaleY(2) scale(1.5)';
            dogIsSitting = false;
            dogX -= 1; // move out of sitting spot
        }, 3000);
    } 
    else if (dogX <= dogMinX) {
        dogDirection = 1; // Face right
        dog.style.transform = 'scaleX(2) scaleY(2) scale(1.5)';
    }
    
    dog.style.left = `${dogX}px`;
}
}

requestAnimationFrame(gameLoop);
}

player.style.left = `${playerPosition}px`;
gameLoop();
