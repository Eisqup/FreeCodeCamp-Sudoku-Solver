const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//1. Solve a puzzle with valid puzzle string: POST request to /api/solve
//2. Solve a puzzle with missing puzzle string: POST request to /api/solve
//3. Solve a puzzle with invalid characters: POST request to /api/solve
//4. Solve a puzzle with incorrect length: POST request to /api/solve
//5. Solve a puzzle that cannot be solved: POST request to /api/solve
//6. Check a puzzle placement with all fields: POST request to /api/check
//7. Check a puzzle placement with single placement conflict: POST request to /api/check
//8. Check a puzzle placement with multiple placement conflicts: POST request to /api/check
//9. Check a puzzle placement with all placement conflicts: POST request to /api/check
//10. Check a puzzle placement with missing required fields: POST request to /api/check
//11. Check a puzzle placement with invalid characters: POST request to /api/check
//12. Check a puzzle placement with incorrect length: POST request to /api/check
//13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check
//14. Check a puzzle placement with invalid placement value: POST request to /api/check

const {puzzlesAndSolutions} = require('../controllers/puzzle-strings')
const validPuzzle =             puzzlesAndSolutions[0][0]
const validPuzzleSolutiioin =    puzzlesAndSolutions[0][1]
const invalidPuzzleLength =     '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16...926914.37.'
const invalidPuzzleCharacter =  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37d'
const invalidToSolve =          '111..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'



suite('Functional Tests', () => {

    test("1. Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) =>{
        chai.request(server)
            .post("/api/solve")
            .send({puzzle:validPuzzle})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.solution, validPuzzleSolutiioin);
                done()
            })
    });
    test("2. Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) =>{
        chai.request(server)
            .post("/api/solve")
            .send({puzzle:""})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"error":"Required field missing"})
                done()
            })
    });
    test("3. Solve a puzzle with invalid characters: POST request to /api/solve", (done) =>{
        chai.request(server)
            .post("/api/solve")
            .send({puzzle:invalidPuzzleCharacter})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"error":"Invalid characters in puzzle"})
                done()
            })
    });
    test("4. Solve a puzzle with incorrect length: POST request to /api/solve", (done) =>{
        chai.request(server)
            .post("/api/solve")
            .send({puzzle:invalidPuzzleLength})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, { "error": "Expected puzzle to be 81 characters long" })
                done()
            })
    })
    test("5. Solve a puzzle that cannot be solved: POST request to /api/solve", (done) =>{
        chai.request(server)
            .post("/api/solve")
            .send({puzzle:invalidToSolve})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, { error: 'Puzzle cannot be solved' })
                done()
            })
    })
    test("6. Check a puzzle placement with all fields: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a1",
                   "value":"1"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"valid":true})
                done()
            })
    })
    test("7. Check a puzzle placement with single placement conflict: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a1",
                   "value":"3"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"valid":false,"conflict":["column"]})
                done()
            })
    })
    test("8. Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a1",
                   "value":"5"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"valid":false,"conflict":["row","region"]})
                done()
            })
    })
    test("9. Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a2",
                   "value":"2"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body, {"valid":false,"conflict":["row","column","region"]})
                done()
            })
    })
     test("10. Check a puzzle placement with missing required fields: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"",
                   "value":"2"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body,{"error":"Required field(s) missing"})
                done()
            })
    })
    test("11. Check a puzzle placement with invalid characters: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:invalidPuzzleCharacter,
                   "coordinate":"a1",
                   "value":"1"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body,{"error":"Invalid characters in puzzle"})
                done()
            })
    })
    test("12. Check a puzzle placement with incorrect length: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:invalidPuzzleLength,
                   "coordinate":"a1",
                   "value":"1"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body,{"error":"Expected puzzle to be 81 characters long"})
                done()
            })
    })
    test("13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a11",
                   "value":"1"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body,{"error":"Invalid coordinate"})
                done()
            })
    })
    test("14. Check a puzzle placement with invalid placement value: POST request to /api/check", (done) =>{
        chai.request(server)
            .post("/api/check")            
            .send({puzzle:validPuzzle,
                   "coordinate":"a1",
                   "value":"10"})
            .end((err, res) =>{
                assert.isNull(err);
                assert.equal(res.status, 200);
                assert.deepStrictEqual(res.body,{"error":"Invalid value"})
                done()
            })
    })
    
    after(()=>{
        chai.request(server)
            .get('/')
    })
});

