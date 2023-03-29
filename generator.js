function getNthValueFromSet(set, index) {
    let i = 0
    for (const val of set) {
        if (i === index) { return val }
        i++
    }
    throw new Error("Index Too Big")
}

function resetSudoku() {
    let sudoku = []
    for (let i = 0; i < 9; i++) {
        sudoku.push([])
        for (let j = 0; j < 9; j++) {
            let inner = [0, new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])]
            sudoku[i].push(inner)
        }
    }
    return sudoku
}

async function createRandomSudoku() {
    let sudoku = resetSudoku()

    while (!isSolved(sudoku)) {
        let min = 10
        let minPos;
        for (let y = 0; y < sudoku.length; y++) {
            for (let x = 0; x < sudoku[y].length; x++) {
                if (!sudoku[y][x][1].size) { continue }
                sudoku[y][x][1] = possibleMoves(sudoku, y, x, sudoku[y][x][1])
                if (sudoku[y][x][1].size < min) {
                    min = sudoku[y][x][1].size
                    minPos = [y, x]
                }
            }
        }
        // Have Min
        let [y, x] = minPos
        if (!sudoku[y][x][1].size) { sudoku = resetSudoku(); continue }
        let i = Math.floor(Math.random() * sudoku[y][x][1].size)
        sudoku[y][x][0] = getNthValueFromSet(sudoku[y][x][1], i)
        sudoku[y][x][1].clear()
    }

    return sudoku.map(r => r.map(e => e[0]))
}

function getUsed(arr) {
    let vals = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j]) { vals.push([i, j]) }
        }
    }
    return vals
}

function equal(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) { return false }
        }
    }
    return true
}

async function generateSudoku(difficulty) {
    let board = await createRandomSudoku()

    let history = []

    while (true) {
        // Choose Random Cell
        let used = getUsed(board)
        history.push(structuredClone(board)) 

        o: while (used.length) {
            const i = Math.floor(Math.random() * used.length)
            const [y, x] = used[i]
            let t = board[y][x]
            board[y][x] = 0
            board.forEach(r => console.log(r.join(" ")))
            console.log("--------------------")
            history[0].forEach(r => console.log(r.join(" ")))
            console.log("--------------------")
            const solve = await solve2(board.map(r => r.map(e => [e, e 
            ? new Set() : new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])])), print = false)
            
            if (solve[0].length > 1 || solve[1] > difficulty) {
                board[y][x] = t
                used.pop(i)
            } else { break o }
        }

        if (equal(history[history.length - 1], board)) {
            show(board)
            save();
            return history.pop()
        }
    }
}