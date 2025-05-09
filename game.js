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
const floor = document.querySelector('.floor');
let cameraOffsetX = 0;
const worldWidth = 2000; // match floor width
const halfViewport = gameboxWidth / 2;


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

function gameLoop() {
    if (keys.ArrowLeft) {
        playerPosition = Math.max(0 + playerWidth, playerPosition - moveSpeed);
        if (isFacingRight) {
            player.style.transform = 'translateX(-50%) scaleX(-2.5) scaleY(2.5)';
            isFacingRight = false;
        }
    } 
    else if (keys.ArrowRight) {
        playerPosition = Math.min(gameboxWidth - playerWidth, playerPosition + moveSpeed);
        if (!isFacingRight) {
            player.style.transform = 'translateX(-50%) scaleX(2.5) scaleY(2.5)';
            isFacingRight = true;
        }
    }
    
    player.style.left = `${playerPosition}px`;
    requestAnimationFrame(gameLoop);
}

player.style.left = `${playerPosition}px`;
gameLoop();
