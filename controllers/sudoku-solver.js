class SudokuSolver {

    validate(puzzleString) {
        //return puzzleString.length == 81
        if(puzzleString.length !== 81){
            return { "error": "Expected puzzle to be 81 characters long" }
        }
        if (puzzleString.match(/[^1-9.]/)){
            return { "error": "Invalid characters in puzzle" }
        }
        return false
    }

    checkRowPlacement(puzzleGrid, row, col, value) {
        return !puzzleGrid[row-1].includes(value) || puzzleGrid[row-1][col-1] == value
    }

    checkColPlacement(puzzleGrid, row, column, value) {
        const colValeues = puzzleGrid.map((row) => row[column-1])
        return !colValeues.includes(value) || colValeues[row-1] == value
    }

    checkRegionPlacement(puzzleGrid, row, column, value) {

        const regionRow = Math.floor((row-1 )/ 3) * 3;
        const regionCol = Math.floor((column-1) / 3) * 3;

        const regionValues = puzzleGrid.reduce((last, current, index) => {
            if (regionRow <= index && index < regionRow + 3) {
                for (let x = 0; x < 3; x++) {
                    last.push(current[x + regionCol]);
                }
            }
            return last;
        }, []);
        while (row > 3) {
            row -= 3;
        }
        while (column > 3) {
            column -= 3;
        }
        return !regionValues.includes(value) || regionValues[row*column-1] == value
    }

    solve(puzzleString) {

        if (this.validate(puzzleString)) {
            return false
        }
        const puzzle = this.createGrid(puzzleString)

        const emptyCell = () => {
            for (let row = 1; row <= 9; row++) {
                for (let col = 1; col <= 9; col++) {
                    if (puzzle[row-1][col-1] == ".") {
                        return [row, col]
                    }
                }
            }
            return null
        }

        if (emptyCell() == null) {
            return puzzleString // puzzle done
        }
        const [row, col] = emptyCell()

        for (let num = 1; num <= 9; num++) {
            const value = num.toString()

            if (this.checkRowPlacement(puzzle, row, col, value) &&
                this.checkColPlacement(puzzle, row, col, value) &&
                this.checkRegionPlacement(puzzle, row, col, value)) {
                puzzle[row-1][col-1] = value // new value insert in empty cell

                const solvedPuzzle = this.solve(puzzle.flat().join(""));
                if (solvedPuzzle) {
                    return solvedPuzzle;
                }

                puzzle[row-1][col-1] = "."; // didnt work /rework choise
            }
        }
        return false
    }

    createGrid(puzzle) {
        let row = [];
        let grid = [];

        for (let x = 0; x <= puzzle.length; x++) {
            row.push(puzzle[x])

            if (row.length == 9) {
                grid.push(row)
                row = []
            }
        }
        return grid
    }
}

module.exports = SudokuSolver;

