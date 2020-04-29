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
        this.score = 0;
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
     * Create snake game default board
     * With snake body and food
     */
    _createDefault() {
        this._createDefaultSnake();
        this.createFood();
        this.score = 0;
    }

    /**
     * Create snake default body
     * Length = default_length
     */
    _createDefaultSnake() {
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
     * Create food for snake
     * Give random coordinates(different from snake body)
     * Add on board
     */
    createFood() {
        let food = document.createElement("div");
        food.setAttribute('class', 'cube');
        food.setAttribute('id', 'food');

        let board = document.getElementById("board");
        board.appendChild(food);
        this.changeFoodCoordinates();
    }

    /**
     * Change food coordinates on the board
     * It must be different from snake's body coordinates at that time
     */
    changeFoodCoordinates() {
        let food = document.getElementById("food");
        let limit = (CONFIG.BOARD_SIZE / CONFIG.SNAKE_CUBE_DIM);
        let x = Math.floor(Math.random() * limit);
        let y = Math.floor(Math.random() * limit);

        food.style.left = 0 + x * CONFIG.SNAKE_CUBE_DIM + "px";
        food.style.top = 0 + y * CONFIG.SNAKE_CUBE_DIM + "px";
    }

    resetSnake() {
        this.body = [];
        this.changeDirection(0);
        this._createDefault();
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

    let head = document.getElementById("cube0");
    let food = document.getElementById("food");


    if (head.offsetLeft == food.offsetLeft && head.offsetTop == food.offsetTop) {
        snake.score++;
        snake.changeFoodCoordinates();
    }
}

/**
 * Move snake to direction
 * Move every body element to its next's place(starting from last)
 * Move head to its direction
 */
function move() {
    let dir = snake.getDirection();

    if (dir != 0) {
        // Move every cube to its next's place
        for (let i = snake.body.length - 1; i >= 1; i--) {
            let cube = document.getElementById('cube' + String(i));
            let frontCube = document.getElementById('cube' + String(i - 1));
            cube.style.left = frontCube.style.left;
            cube.style.top = frontCube.style.top;
        }

        // get head cube of the snake
        let head = document.getElementById("cube0");
        head.style.left = parseInt(head.offsetLeft) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][0]) + "px";
        head.style.top = parseInt(head.offsetTop) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][1]) + "px";

        if (!checkBounds(head)) {
            resetBoard();
        }
    }
}

/**
 * Check if element(cube) is in bounds
 * @param {Object} elem - element to check   
 * return true if in bounds
 * false otherwise
 */
function checkBounds(elem) {
    if (elem.offsetLeft < 0 || elem.offsetTop < 0) return false;
    if (elem.offsetLeft > (CONFIG.BOARD_SIZE - CONFIG.BOARD_BORDER) || elem.offsetTop > (CONFIG.BOARD_SIZE - CONFIG.BOARD_BORDER)) return false;
    return true;
}


/**
 * Reset board function
 * Remove all cubes, create default starting snake
 */
function resetBoard() {
    let board = document.getElementById("board");
    board.innerHTML = "";
    snake.resetSnake();
}

window.onload = init;