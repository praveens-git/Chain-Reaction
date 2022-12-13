let cells = [];
const maxRows = 10;
const maxCols = 8;

const numberOfPlayers = 2;

const playerColors = ["red", "green", "blue"]
let currentPlayers = playerColors.filter((v, i) => i < numberOfPlayers);
let currentPlayer = 0;
let frame;

let ballSvg = undefined;

let hasStarted = false;

async function delay(ms) {
    return new Promise((res, rej) => {
        setTimeout(() => { res() }, ms);
    });
}

function getBallSvg() {
    fetch("./ball.svg").then(response => {
        response.text().then(t => {
            ballSvg = t;
        });
    }).catch(e => {
        console.log(e);
        console.log("Fetch Error!");
    });
}

function switchPlayers() {
    currentPlayer++;
    if (currentPlayer >= currentPlayers.length) {
        currentPlayer = 0;
        hasStarted = true;
    }
    document.querySelectorAll("#currentPlayerDiv>svg>g>g>.SVG_white_area").forEach(i => i.style.fill = `${currentPlayers[currentPlayer]}`);
}

function onCellClick(e) {
    let CellId = e.target.id;
    if (e.target.id) {
        CellId = e.target.id;
    } else {
        CellId = e.target.parentElement.id;
    }


    if (cells[e.target.id].count == 0) {
        cells[e.target.id].count++;
        cells[e.target.id].setColor(currentPlayers[currentPlayer]);
        switchPlayers();
    } else if (cells[e.target.id].color == currentPlayers[currentPlayer]) {
        cells[e.target.id].count++;
        cells[e.target.id].setColor(currentPlayers[currentPlayer]);
        switchPlayers();
    }
    // cells[e.target.id].count++;

    // cells[e.target.id].neighbourCells.forEach(c => c.count++);
}

function getlocation(i, j) {
    return (i * 8) + j;
}

let playerDotsCount = currentPlayers.map(() => 0);

function hasPlayerGameOver() {
    if (!hasStarted) return;

    if (currentPlayers.length == 1) {
        alert("Game Over");
        clearInterval(frame);
        document.querySelectorAll("#over>div").forEach(d => d.removeEventListener('click', onCellClick));
    }

    playerDotsCount = playerDotsCount.map((i) => i * 0);
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i].color;
        if (currentPlayers.findIndex((x) => x == c) >= 0) {
            playerDotsCount[currentPlayers.findIndex((x) => x == c)]++;
        }
    }
    for (let i = 0; i < playerDotsCount.length; i++) {
        if (playerDotsCount[i] == 0) {
            currentPlayers = currentPlayers.slice(i, 1);
            console.log(playerDotsCount);
        }
    }
}

function setNeighbours() {
    cells.forEach(cell => {
        let ns = [];
        if ((cell.i > 0 && cell.i < maxRows - 1) && (cell.j > 0 && cell.j < maxCols - 1)) {
            ns.push(cells[getlocation(cell.i - 1, cell.j)]);
            ns.push(cells[getlocation(cell.i + 1, cell.j)]);
            ns.push(cells[getlocation(cell.i, cell.j - 1)]);
            ns.push(cells[getlocation(cell.i, cell.j + 1)]);
        } else {
            if (cell.i == 0) {
                ns.push(cells[getlocation(cell.i + 1, cell.j)]);
            } else if (cell.i == maxRows - 1) {
                ns.push(cells[getlocation(cell.i - 1, cell.j)]);
            } else {
                ns.push(cells[getlocation(cell.i - 1, cell.j)]);
                ns.push(cells[getlocation(cell.i + 1, cell.j)]);
            }
            if (cell.j == 0) {
                ns.push(cells[getlocation(cell.i, cell.j + 1)]);
            } else if (cell.j == maxCols - 1) {
                ns.push(cells[getlocation(cell.i, cell.j - 1)]);
            } else {
                ns.push(cells[getlocation(cell.i, cell.j - 1)]);
                ns.push(cells[getlocation(cell.i, cell.j + 1)]);
            }
        }
        cell.setNeighbours(ns);
    });
}

frame = setInterval(() => {
    // document.querySelector("#currentPlayerDiv").textContent = currentPlayer;
    cells.forEach(cell => cell.update());
    hasPlayerGameOver();
}, 100);

async function initGrid() {
    await delay(100);
    const containerWhole = document.createElement("div");
    containerWhole.id = "containerWhole";
    const PlayerDiv = document.createElement("div");
    const PlayerCountDiv = document.createElement("div");
    const CurPlayerDiv = document.createElement("div");
    CurPlayerDiv.innerHTML = ballSvg;
    CurPlayerDiv.id = "currentPlayerDiv";
    PlayerCountDiv.textContent = `Number of Player: ${numberOfPlayers}`;
    PlayerDiv.id = "playerInfo"
    PlayerDiv.appendChild(PlayerCountDiv);
    PlayerDiv.appendChild(CurPlayerDiv);
    const container = document.createElement("div");
    container.id = "container";
    for (let i = 0; i < maxRows; i++) {
        const over = document.createElement("div");
        over.id = "over";
        for (let j = 0; j < maxCols; j++) {
            const innerDiv = document.createElement("div");
            innerDiv.id = i * maxCols + j;
            over.appendChild(innerDiv);
            cells.push(new Cell(i, j, innerDiv, ballSvg));
        }
        container.appendChild(over);
    }
    containerWhole.appendChild(PlayerDiv);
    containerWhole.appendChild(container);
    document.body.appendChild(containerWhole);
    setNeighbours();
    document.querySelectorAll("#currentPlayerDiv>svg>g>g>.SVG_white_area").forEach(i => i.style.fill = `${currentPlayers[currentPlayer]}`);
    document.querySelectorAll("#over>div").forEach(d => d.addEventListener('click', onCellClick));
}

getBallSvg();
initGrid();