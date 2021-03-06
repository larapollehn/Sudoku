import Square from "./Square";
import Utility from "./Utility";
import {numberAnimalsMapping} from "../Globals";

export default class Generator {
    private squares: Array<Square>; // will hold all 81 squares of the sudoku
    private available: Array<Array<number>>; // stores the value 1-9 available for each empty square
    private count: number; // the index of the square in the sudoku that is about to be filled with a value

    private setUp(): void {
        this.squares = new Array<Square>(81);
        this.available = new Array<Array<number>>(81);
        this.count = 0;

        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i] = new Square();
        }
        for (let i = 0; i < this.squares.length; i++) {
            this.available[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }
    }

    // based on the index and possible value an example square is created
    // used later to check if it fits in the partially filled sudoku
    private createSquare(index: number, value: number): Square {
        let square = new Square();
        square.column = Utility.getColumn(index + 1);
        square.row = Utility.getRow(index + 1);
        square.subGrid = Utility.getSubGrid(index + 1);
        square.value = value;
        square.index = index;
        square.picture = numberAnimalsMapping.get(value);
        return square;
    }

    // check if example square would fit in partially filled square
    // meaning: the value of this square is neither in the row, column or subgrid
    private static hasConflict(squares: Array<Square>, option: Square): boolean {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].column === option.column ||
                squares[i].row === option.row ||
                squares[i].subGrid === option.subGrid) {
                if (squares[i].value === option.value) {
                    return true;
                }
            }
        }
        return false;
    }

    private generateGrid() {
        this.setUp();
        while (this.count < 81) {
            if (this.available[this.count].length !== 0) { //if there are possible values left for the current square
                let nextIndex = Utility.getRandomNumber(this.available[this.count].length) //get random number/index between 0 and last index of array
                let value = this.available[this.count][nextIndex];

                if (Generator.hasConflict(this.squares, this.createSquare(this.count, value)) === false) { //if the randomly chosen value provides no conflict
                    this.squares[this.count] = this.createSquare(this.count, value); //generate a square and add to squares at current count/index
                    this.available[this.count].splice(nextIndex, 1); //remove the value for this square
                    this.count += 1;
                } else {
                    this.available[this.count].splice(nextIndex, 1);
                }
            } else { //if no possible values for the current square are left
                this.available[this.count] = [1, 2, 3, 4, 5, 6, 7, 8, 9];  //make all possible values in range 1-9 available for this square
                this.squares[this.count - 1] = new Square(); // backtrack to square before the current one
                this.count -= 1;
            }
        }
    }

    // remove value of randomly chosen squares to build a solvable sudoku
    generateSudoku(freeSquares: number){
        this.generateGrid();
        let erased = new Set<number>();
        while (freeSquares > 0){
            let index = Utility.getRandomNumber(81);
            if (!erased.has(index)) {
                erased.add(index);
                this.squares[index].value = 0;
                freeSquares--;
            }
        }
        return this.squares;
    }
}
