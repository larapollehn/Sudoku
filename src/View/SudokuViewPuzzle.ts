import Square from "../Sudoku/Square";

export default class SudokuViewPuzzle {
    public sudokuList: HTMLElement = document.getElementById('sudokuList');
    public generateBtn: HTMLElement = document.getElementById('generateBtn');

    constructor() {
        this.displaySudoku = this.displaySudoku.bind(this);
    }

    displaySudoku(sudoku: Array<Square>) {
        while (this.sudokuList.hasChildNodes()) {
            this.sudokuList.removeChild(this.sudokuList.firstChild);
        }

        sudoku.forEach(square => {
            let li = document.createElement('li');
            li.classList.add('sudokuLiElement');
            li.id = String(square.index);
            let span = document.createElement('span');
            if (square.value !== 0) {
                span.innerText = String(square.value);
            }
            li.appendChild(span);
            this.sudokuList.appendChild(li);
        })
    }

}