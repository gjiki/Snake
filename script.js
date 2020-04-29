import * as CONFIG from "./config.js";

var snake = null;
var gameInterval = null;

/**
 * Init fuction to call on window.onLoad
 */
function init() {
    onkeydown = getKeyAndMove;
    snake = new Snake(CONFIG.SNAKE_DEFAULT_LENGTH);
    gameInterval = setInterval(play, CONFIG.INTERVAL);
}

class Snake {
    constructor(default_length) {
        this.body = [];
        this.length = 0;
        this._direction = 0;
        this._default_length = default_length;
        this._createDefault();
    }

    /**
     * Get current direction of snake
     */
    getDirection() {
        return this._direction;
    }

    /**
     * Change snake's _direction with direction
     * @param {type} direction 
     */
    changeDirection(direction) {
        this._direction = direction;
    }

    /**
     * Create snake default body
     * Length = default_length
     */
    _createDefault() {
        for (let i = 0; i < this._default_length; i++) {
            let cubeId = 'cube' + i;
            let cube = this._createOneCube(cubeId);

            cube.style.left = parseInt(cube.offsetLeft) + (this._default_length - i - 1) * CONFIG.SNAKE_CUBE_DIM + "px";
            cube.style.top = 0 + "px";

            let arr = []
            arr.push(cube.offsetLeft);
            arr.push(cube.offsetTop);
            this.body.push(arr);
        }
    }

    /**
     * Create one cube element and add to board div
     * @param {String} id - create new element with this id
     * return created cube
     */
    _createOneCube(id) {
        let cube = document.createElement("div");
        cube.setAttribute('id', id);
        cube.setAttribute('class', 'cube');

        let board = document.getElementById("board");
        board.appendChild(cube);
        return cube;
    }
}

// Direction vectors for keyCode values
const DIRECTIONS = {
    0: [0, 0],
    37: [-1, 0], // left
    39: [1, 0], // right
    38: [0, -1], // up
    40: [0, 1] // down
}

/**
 * Check which key is pressed
 * Change direction if its arrow key
 * Pause and Start in cases : P and S
 * @param {Object} e - keyboard value
 */
function getKeyAndMove(e) {
    var key_code = e.which || e.keyCode;
    // console.log(key_code);
    switch (key_code) {
        case 37:
            snake.changeDirection(key_code);
            break;
        case 38:
            snake.changeDirection(key_code);
            break;
        case 39:
            snake.changeDirection(key_code);
            break;
        case 40:
            snake.changeDirection(key_code);
            break;
        case 80:
            clearInterval(gameInterval);
            break;
        case 83:
            gameInterval = setInterval(play, CONFIG.INTERVAL);
            break;
        default:
            break;
    }
}

/**
 * Game progress logic
 * Starting this function on every interval
 */
function play() {
    move();
}

/**
 * Move snake to direction
 * Move every body element to its next one(starting from last)
 * Move head to its direction
 */
function move() {
    let dir = snake.getDirection();

    if (dir != 0) {
        for (let i = snake.body.length - 1; i >= 1; i--) {
            let cube = document.getElementById('cube' + String(i));
            let frontCube = document.getElementById('cube' + String(i - 1));
            cube.style.left = frontCube.style.left;
            cube.style.top = frontCube.style.top;
        }

        let elem = document.getElementById("cube0");
        elem.style.left = parseInt(elem.offsetLeft) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][0]) + "px";
        elem.style.top = parseInt(elem.offsetTop) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][1]) + "px";
    }
}

/**
 * Check if element(cube) is in bounds
 * @param {Object} elem - element to check   
 * return 1 if in bounds
 * 0 otherwise
 */
function checkBounds(elem) {
    if (elem.offsetLeft < 0 || elem.offsetTop < 0) return 0;
    if (elem.offsetLeft > 510 || elem.offsetTop > 510) return 0;
    return 1;
}

window.onload = init;