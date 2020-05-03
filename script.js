import * as CONFIG from "./config.js";

var snake = null;
var intervalValue = 0;
var gameInterval = null;
var lastButton = null;
var changeOptions = true;

/**
 * Init fuction to call on window.onLoad
 */
function init() {
    onkeydown = getKeyAndMove;

    // Add event handlers for buttons
    document.getElementById('pause').addEventListener('click', pauseClick);
    document.getElementById('start').addEventListener('click', startClick);
    document.getElementById('border-option').addEventListener('click', borderOptionClick);
    document.getElementById('easy-level').addEventListener('click', easyLevel);
    document.getElementById('medium-level').addEventListener('click', mediumLevel);
    document.getElementById('hard-level').addEventListener('click', hardLevel);
    document.getElementById('expert-level').addEventListener('click', expertLevel);

    if (localStorage.getItem('currentLevel') == null) localStorage.setItem('currentLevel', 'medium');
    document.getElementById(localStorage.getItem('currentLevel') + '-level').setAttribute('class', 'level-button');

    if (localStorage.getItem('borderOption') == null) localStorage.setItem('borderOption', 'true');
    if (localStorage.getItem('borderOption') == 'true') {
        document.getElementById('border-option').innerHTML = 'Border On';
    } else {
        document.getElementById('border-option').innerHTML = 'Border Off';
    }

    if (localStorage.getItem('score') == null) localStorage.setItem('score', '0');

    switch (localStorage.getItem('currentLevel')) {
        case 'easy':
            intervalValue = CONFIG.EASY_INTERVAL;
            break;
        case 'medium':
            intervalValue = CONFIG.MEDIUM_INTERVAL;
            break;
        case 'hard':
            intervalValue = CONFIG.HARD_INTERVAL;
            break;
        case 'expert':
            intervalValue = CONFIG.EXPERT_INTERVAL;
            break;
        default:
            break;
    }

    snake = new Snake(CONFIG.SNAKE_DEFAULT_LENGTH);
    gameInterval = setInterval(play, intervalValue);
}


/**
 * Event handler function for pause button click
 */
function pauseClick() {
    if (lastButton != 'pause') {
        clearInterval(gameInterval);
        lastButton = 'pause';
    }
}

/**
 * Event handler function for start button click
 */
function startClick() {
    if (lastButton != 'start') {
        gameInterval = setInterval(play, intervalValue);
        lastButton = 'start';
    }
}

/*
 * Event handler function for borderOption button click
 */
function borderOptionClick() {
    if (changeOptions) {
        let borderOptionElem = document.getElementById("border-option");
        if (borderOptionElem.innerHTML == 'Border On') {
            borderOptionElem.innerHTML = 'Border Off';
            localStorage.setItem('borderOption', 'false');
        } else {
            borderOptionElem.innerHTML = 'Border On';
            localStorage.setItem('borderOption', 'true');
        }
    }
}

/*
 * Event handler function for easyLevel button click
 */
function easyLevel() {
    if (changeOptions) {
        document.getElementById('easy-level').setAttribute('class', 'level-button');
        document.getElementById(localStorage.getItem('currentLevel') + '-level').removeAttribute('class');
        localStorage.setItem('currentLevel', 'easy');
        intervalValue = CONFIG.EASY_INTERVAL;

        clearInterval(gameInterval);
        gameInterval = setInterval(play, intervalValue);
    }
}

/*
 * Event handler function for mediumLevel button click
 */
function mediumLevel() {
    if (changeOptions) {
        document.getElementById('medium-level').setAttribute('class', 'level-button');
        document.getElementById(localStorage.getItem('currentLevel') + '-level').removeAttribute('class');
        localStorage.setItem('currentLevel', 'medium');
        intervalValue = CONFIG.MEDIUM_INTERVAL;

        clearInterval(gameInterval);
        gameInterval = setInterval(play, intervalValue);
    }
}

/*
 * Event handler function for hardLevel button click
 */
function hardLevel() {
    if (changeOptions) {
        document.getElementById('hard-level').setAttribute('class', 'level-button');
        document.getElementById(localStorage.getItem('currentLevel') + '-level').removeAttribute('class');
        localStorage.setItem('currentLevel', 'hard');
        intervalValue = CONFIG.HARD_INTERVAL;

        clearInterval(gameInterval);
        gameInterval = setInterval(play, intervalValue);
    }
}

/*
 * Event handler function for expertLevel button click
 */
function expertLevel() {
    if (changeOptions) {
        document.getElementById('expert-level').setAttribute('class', 'level-button');
        document.getElementById(localStorage.getItem('currentLevel') + '-level').removeAttribute('class');
        localStorage.setItem('currentLevel', 'expert');
        intervalValue = CONFIG.EXPERT_INTERVAL;

        clearInterval(gameInterval);
        gameInterval = setInterval(play, intervalValue);
    }
}

// Snake class
class Snake {
    constructor(default_length) {
        this.body = [];
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
            cube.style.top = 0 + 'px';

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
        let food = document.createElement('div');
        food.setAttribute('class', 'cube');
        food.setAttribute('id', 'food');

        let board = document.getElementById('board');
        board.appendChild(food);
        this.changeFoodCoordinates();
    }

    /**
     * Change food coordinates on the board
     * It must be different from snake's body coordinates at that time
     */
    changeFoodCoordinates() {
        let food = document.getElementById('food');
        let cont = true;

        while (cont) {
            let limit = ((CONFIG.BOARD_SIZE - 2 * CONFIG.BOARD_BORDER) / CONFIG.SNAKE_CUBE_DIM);
            let x = Math.floor(Math.random() * limit);
            let y = Math.floor(Math.random() * limit);

            food.style.left = x * CONFIG.SNAKE_CUBE_DIM + 'px';
            food.style.top = y * CONFIG.SNAKE_CUBE_DIM + 'px';

            // Food mustn't be on body's coordinate
            for (let i = 0; i < this.body.length; i++) {
                if (food.offsetLeft == this.body[i][0] && food.offsetTop == this.body[i][1]) {
                    break;
                } else {
                    cont = false;
                    break;
                }
            }
        }
    }

    /**
     * Function to check if head collides any other body element
     * Return type : Bool
     * True if collides, false otherwise
     */
    checkCollision() {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0][0] == this.body[i][0] && this.body[0][1] == this.body[i][1]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Reset snake values :
     *      Body
     *      Direction
     */
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
        let cube = document.createElement('div');
        cube.setAttribute('id', id);
        cube.setAttribute('class', 'cube');

        let board = document.getElementById('board');
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
            // left
            if (snake.getDirection() != 39) snake.changeDirection(key_code);
            changeOptions = false;
            break;
        case 38:
            // up
            if (snake.getDirection() != 40) snake.changeDirection(key_code);
            changeOptions = false;
            break;
        case 39:
            // right
            if (snake.getDirection() != 37) snake.changeDirection(key_code);
            changeOptions = false;
            break;
        case 40:
            // down
            if (snake.getDirection() != 38) snake.changeDirection(key_code);
            changeOptions = false;
            break;
        case 80:
            // p
            pauseClick();
            changeOptions = false;
            break;
        case 83:
            // s
            startClick();
            changeOptions = false;
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

    let head = document.getElementById('cube0');
    let food = document.getElementById('food');

    if (head.offsetLeft == food.offsetLeft && head.offsetTop == food.offsetTop) {
        let score = parseInt(localStorage.getItem('score')) + 1;
        localStorage.setItem('score', String(score));

        let lastCube = document.getElementById('cube' + String(snake.body.length - 1));
        let lastOffsetLeft = lastCube.offsetLeft;
        let lastOffsetTop = lastCube.offsetTop;

        let newCube = document.createElement('div');
        newCube.setAttribute('class', 'cube');
        newCube.setAttribute('id', 'cube' + String(snake.body.length));

        let board = document.getElementById('board');
        board.appendChild(newCube);
        newCube.style.left = lastOffsetLeft + 'px';
        newCube.style.top = lastOffsetTop + 'px';

        let arr = []
        arr.push(newCube.offsetLeft);
        arr.push(newCube.offsetTop);
        snake.body.push(arr);

        let scoreElement = document.getElementById('score');
        scoreElement.value = 'Score : ' + String(score);
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
            cube.style.left = snake.body[i - 1][0] + 'px';
            cube.style.top = snake.body[i - 1][1] + 'px';

            // Save body changes in snake object
            snake.body[i][0] = cube.offsetLeft;
            snake.body[i][1] = cube.offsetTop;
        }

        // get head cube of the snake
        let head = document.getElementById('cube0');
        head.style.left = parseInt(head.offsetLeft) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][0]) + 'px';
        head.style.top = parseInt(head.offsetTop) + CONFIG.SNAKE_CUBE_DIM * (DIRECTIONS[dir][1]) + 'px';

        // Save body changes in snake object
        snake.body[0][0] = head.offsetLeft;
        snake.body[0][1] = head.offsetTop;

        if (!checkBounds(head)) {
            if (localStorage.getItem('borderOption') == 'true') {
                resetBoard();
            } else {
                let boardLimit = CONFIG.BOARD_SIZE - 2 * CONFIG.BOARD_BORDER;

                if (snake.body[0][0] >= boardLimit) {
                    head.style.left = 0 + 'px';
                } else if (snake.body[0][0] < 0) {
                    head.style.left = boardLimit - CONFIG.SNAKE_CUBE_DIM + 'px';
                } else if (snake.body[0][1] >= boardLimit) {
                    head.style.top = 0 + 'px';
                } else if (snake.body[0][1] < 0) {
                    head.style.top = boardLimit - CONFIG.SNAKE_CUBE_DIM + 'px';
                }

                // Save body changes in snake object
                snake.body[0][0] = head.offsetLeft;
                snake.body[0][1] = head.offsetTop;
            }
        }

        if (snake.checkCollision()) {
            resetBoard();
        }

        /*console.log(snake.body[0][0]);
        console.log(snake.body[0][1]);
        console.log('\n');*/
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
    let limit = (CONFIG.BOARD_SIZE - 2 * CONFIG.BOARD_BORDER - CONFIG.SNAKE_CUBE_DIM);
    if (elem.offsetLeft > limit || elem.offsetTop > limit) return false;
    return true;
}

/**
 * Reset board function
 * Remove all cubes, create default starting snake
 */
function resetBoard() {
    changeOptions = true;
    let board = document.getElementById('board');
    board.innerHTML = '';
    localStorage.setItem('score', '0');
    snake.resetSnake();
    document.getElementById('score').value = 'Score : 0';
}

window.onload = init;