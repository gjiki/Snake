import * as CONFIG from "./config.js";

var snake = null;
var gameInterval = null;

function init() {
    onkeydown = getKeyAndMove;
    snake = new Snake(CONFIG.SNAKE_DEFAULT_LENGTH);
    gameInterval = setInterval(play, CONFIG.INTERVAL);
}

class Snake {
    constructor(default_length) {
        this.body = [];
        this.length = 0;
        this.direction = 0;
        this.default_length = default_length;
        this._createDefault();
    }

    _createDefault() {
        for (let i = 0; i < this.default_length; i++) {
            let cubeId = 'cube' + i;
            let cube = this._createOneCube(cubeId);

            cube.style.left = parseInt(cube.offsetLeft) + (this.default_length - i - 1) * CONFIG.SNAKE_CUBE_DIM + "px";
            cube.style.top = 0 + "px";

            let arr = []
            arr.push(cube.offsetLeft);
            arr.push(cube.offsetTop);
            this.body.push(arr);
        }
        console.log(this.body);
    }

    _createOneCube(id) {
        let cube = document.createElement("div");
        cube.setAttribute('id', id);
        cube.setAttribute('class', 'cube');

        let board = document.getElementById("board");
        board.appendChild(cube);
        return cube;
    }
}

const DIRECTIONS = {
    0: [0, 0],
    37: [-1, 0], // left
    39: [1, 0], // right
    38: [0, -1], // up
    40: [0, 1] // down
}

function getKeyAndMove(e) {
    var key_code = e.which || e.keyCode;
    // console.log(key_code);
    if (key_code >= 37 && key_code <= 40) {
        snake.direction = key_code;
    }

    if (key_code == 80) {
        clearInterval(gameInterval);
    }

    if (key_code == 83) {
        gameInterval = setInterval(play, CONFIG.INTERVAL);
    }
}

function play() {
    move();
}

function move() {
    let dir = snake.direction;

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

// >=0 <= 510
function checkBounds(elem) {
    if (elem.offsetLeft < 0 || elem.offsetTop < 0) return 0;
    if (elem.offsetLeft > 510 || elem.offsetTop > 510) return 0;
    return 1;
}

window.onload = init;