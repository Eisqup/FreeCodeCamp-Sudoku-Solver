const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings')
let solver = new Solver();

//1. Logic handles a valid puzzle string of 81 characters
//2. Logic handles a puzzle string with invalid characters (not 1-9 or .)
//3. Logic handles a puzzle string that is not 81 characters in length
//4. Logic handles a valid row placement
//5. Logic handles an invalid row placement
//6. Logic handles a valid column placement
//7. Logic handles an invalid column placement
//8. Logic handles a valid region (3x3 grid) placement
//9. Logic handles an invalid region (3x3 grid) placement
//10. Valid puzzle strings pass the solver
//11. Invalid puzzle strings fail the solver
//12. Solver returns the expected solution for an incomplete puzzle

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const validPuzzleGrid = solver.createGrid(validPuzzle)
//validPuuzelGrid
//['1','.','5' , '.','.','2' , '.','8','4']
//['.','.','6' , '3','.','1' , '2','.','7']
//['.','2','.' , '.','5','.' , '.','.','.']

//['.','9','.' , '.','1','.' , '.','.','.']
//['8','.','2' , '.','3','6' , '7','4','.']
//['3','.','7' , '.','2','.' , '.','9','.']

//['4','7','.' , '.','.','8' , '.','.','1']
//['.','.','1' , '6','.','.' , '.','.','9']
//['2','6','9' , '1','4','.' , '3','7','.']

const invalidPuzzleLength = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16...926914.37.'
const invalidPuzzleCharacter = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37d'
const invalidToSolve = '111..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Unit Tests', () => {

    test("1. Logic handles a valid puzzle string of 81 characters", (done) => {
        assert.isFalse(solver.validate(validPuzzle))
        done()
    })
    test("2. Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) =>{                assert.deepStrictEqual(solver.validate(invalidPuzzleCharacter), 
                               { "error": "Invalid characters in puzzle" })
        done()
    })
    test("3. Logic handles a puzzle string that is not 81 characters in length",(done)=>{
        assert.deepStrictEqual(solver.validate(invalidPuzzleLength), 
                               { "error": "Expected puzzle to be 81 characters long" })
        done()
    })
    test("4. Logic handles a valid row placement",(done)=>{
        assert.isTrue(solver.checkRowPlacement(validPuzzleGrid, "1","1","1"))
        done()
    })
    test("5. Logic handles an invalid row placement",(done)=>{
        assert.isFalse(solver.checkRowPlacement(validPuzzleGrid, "1","2","2"))
        done()
    })
    test("6. Logic handles a valid column placement",(done)=>{
        assert.isTrue(solver.checkColPlacement(validPuzzleGrid, "2","1","5"))
        done()
    })
    test("7. Logic handles an invalid column placement",(done)=>{
        assert.isFalse(solver.checkColPlacement(validPuzzleGrid, "2","1","1"))
        done()
    })
    test("8. Logic handles a valid region (3x3 grid) placement",(done)=>{
        assert.isTrue(solver.checkRegionPlacement(validPuzzleGrid, "2","2","3"))
        done()
    })
    test("9. Logic handles an invalid region (3x3 grid) placement",(done)=>{
        assert.isFalse(solver.checkRegionPlacement(validPuzzleGrid, "2","2","6"))
        done()
    })
    test("10. Valid puzzle strings pass the solver",(done)=>{
        assert.notStrictEqual(solver.solve(puzzlesAndSolutions[0][0]), false)
        done()
    })
    test("11. Invalid puzzle strings fail the solver",(done)=>{
        assert.isFalse(solver.solve(invalidToSolve))
        done()
    })
    test("12. Solver returns the expected solution for an incomplete puzzle",(done)=>{
        puzzlesAndSolutions.forEach((puzzle)=>{
            const solved = solver.solve(puzzle[0])
            assert.strictEqual(solved, puzzle[1])
        })
        done()
    })
});
