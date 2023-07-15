'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

    let solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {

            if (!req.body.puzzle||!req.body.coordinate||!req.body.value) {
                res.send({ error: 'Required field(s) missing' })
                return
            }

            const validate = solver.validate(req.body.puzzle)
            if (validate) {
                res.send(validate)
                return
            }

            const puzzleGrid = solver.createGrid(req.body.puzzle)
            const coordinate = req.body.coordinate
            const value = req.body.value
            const conflict = []

            const row = (coordinate.toUpperCase().charCodeAt(0)-64).toString()
            const col = coordinate.substring(1).toString()

            if (row > 9|| col > 9 || row < 1 || col < 1){
                res.send({ error: 'Invalid coordinate'})
                return
            }
            if (value > 9 || value < 1 || value.match(/[^\d]/) ){
                res.send({ error: 'Invalid value' })
                return
            }

            if (!solver.checkRowPlacement(puzzleGrid, row, col, value)) {
                conflict.push("row")
            }
            if (!solver.checkColPlacement(puzzleGrid, row, col, value)) {
                conflict.push("column")
            }
            if (!solver.checkRegionPlacement(puzzleGrid, row, col, value)) {
                conflict.push("region")
            }
            if (conflict.length !== 0){
                res.send({valid: false, conflict: conflict })
            } else {

                res.send({valid: true})
            }

        });

    app.route('/api/solve')
        .post((req, res) => {

            if (!req.body.puzzle) {
                res.send({ error: 'Required field missing' })
                return
            }

            const validate = solver.validate(req.body.puzzle)
            if (validate) {
                res.send(validate)
                return
            }

            const solvedPuzzle = solver.solve(req.body.puzzle)

            if (solvedPuzzle) {
                res.send({ solution: solvedPuzzle })
            } else {
                res.send({ error: 'Puzzle cannot be solved' })
            }

        });
};
