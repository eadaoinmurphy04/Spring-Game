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
let mouseX = 0;
let mouseY = 0;

colourID = Math.floor(Math.random() * 10); // random colourID for now
changeColour(player);

// changes the colour of the player
// Sprites from 'Bunny Pixel Animations Mega Pack' by ToffeeCraft
function changeColour(player){
    switch (colourID){
        case 0:
            playerImagePath = "url('Images/AllBunniesFree/BlackWhite/";
            break;
        case 1:
            playerImagePath = "url('Images/AllBunniesFree/Brown2Color/";
            break;   
        case 2:
            playerImagePath = "url('Images/AllBunniesFree/BrownWhite/";
            break;
        case 3:
            playerImagePath = "url('Images/AllBunniesFree/BunnyBlack/";
            break;
        case 4:
            playerImagePath = "url('Images/AllBunniesFree/BunnyBrown/";
            break;
        case 5:
            playerImagePath = "url('Images/AllBunniesFree/DemonicBunny/";
            break;   
        case 6:
            playerImagePath = "url('Images/AllBunniesFree/FantasyBunny/";
            break;
        case 7:
            playerImagePath = "url('Images/AllBunniesFree/GreyBunny/";
            break;   
        case 8:
            playerImagePath = "url('Images/AllBunniesFree/LightBrown/";
            break;
        case 9:
            playerImagePath = "url('Images/AllBunniesFree/WhiteBunny/";
            break;   
    }
    player.style.backgroundImage = playerImagePath + "Idle.png')";
}

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
};

// start running
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        player.style.backgroundImage = playerImagePath + "Running.png')";
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
            player.style.backgroundImage = playerImagePath + "Idle.png')";
        }
    }
});

// event listener for moving the mouse
document.addEventListener('mousemove', (e) => {
  const gameboxRect = gamebox.getBoundingClientRect();
  
  // Calculate mouse position in the gamebox
  mouseX = e.clientX - gameboxRect.left - gameboxWidth/2;
  mouseY = e.clientY - gameboxRect.top - gameboxHeight/2;
});

// update hand-cam rotation each frame
function updateHandCam() {
  // calculate angle between player center and mouse
  const angle = Math.atan2(mouseY, mouseX);
  
  // Apply rotation and position
  handcam.style.transform = `
    rotate(${angle}rad)
    translateX(20px) /* Half of handcam width to extend outward */
  `;
}

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
    
    updateHandCam();
    requestAnimationFrame(gameLoop);
}

player.style.left = `${playerPosition}px`;
gameLoop();
