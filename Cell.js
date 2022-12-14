class Cell {
    i = 0;
    j = 0;
    color = "";
    count = 0;
    previousCount = 0;
    neighbours = 0;
    neighbourCells = [];
    element = document.createElement("div");
    ballSVG = undefined;

    constructor(i, j, el, ball) {
        this.i = i;
        this.j = j;
        el.appendChild(this.element);
        // this.element = el;
        if ((i == 0 && j == 0) || (i == 9 && j == 7) || (i == 9 && j == 0) || (i == 0 && j == 7)) {
            this.neighbours = 2;
        } else if (i == 0 || j == 0 || j == 7 || i == 9) {
            this.neighbours = 3;
        } else {
            this.neighbours = 4;
        }
        this.ballSVG = ball;
    }

    setNeighbours(n) {
        this.neighbourCells = n;
    }

    setColor(c) {
        this.color = c;
        this.element.style.color = this.color;
    }

    update() {
        if (this.count != this.previousCount) {
            // this.element.innerText = this.count;
            if (this.count) {
                this.element.classList.add('spinMole');
                this.element.innerHTML = this.ballSVG.repeat(this.count);
                for (let i = 0; i < this.count; i++) {
                    this.element.children[i].style.width = "40%";
                    this.element.children[i].style.pointerEvents = "none";
                    this.element.children[i].style.position = "relative";
                }
                if (this.count == 2) {
                    this.element.children[0].style.left = "10%";
                    this.element.children[1].style.right = "10%";
                } else if (this.count == 3) {
                    this.element.children[0].style.left = "10%";
                    this.element.children[1].style.right = "10%";
                    this.element.children[0].style.top = "10%";
                    this.element.children[1].style.top = "10%";
                    this.element.children[2].style.top = "-110%";
                }
                if (this.count == this.neighbours - 1) {
                    this.element.classList.add('shakeMoleFast');
                } else if ((this.count == this.neighbours - 2)) {
                    this.element.classList.add('shakeMoleSlow');
                }
                this.element.querySelectorAll("svg>g>g>.SVG_white_area").forEach(i => {
                    i.style.fill = this.color;
                });
            }
            this.previousCount = this.count;
        }

        if (!this.count) {
            this.element.innerHTML = "";
        }

        if (this.count >= this.neighbours) {
            this.count = 0;
            this.element.classList.remove('spinMole');
            this.element.classList.remove('shakeMoleFast');
            this.element.classList.remove('shakeMoleSlow');
            this.element.innerHTML = "";
            this.neighbourCells.forEach(c => {
                c.count++;
                c.setColor(this.color);
            });
        }
    }
}

class CellObj extends Cell {
    constructor(obj) {
        super(obj.i, obj.j, obj.element, obj.ballSVG);
        Object.assign(this, obj);
    }
}