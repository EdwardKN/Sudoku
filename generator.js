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

function getUsed(arr) {
    let vals = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j]) { vals.push([i, j]) }
        }
    }
    return vals
}

function possibleMoves(grid, y, x) {
    let arr = getAll(x, y)
    let sat = grid[y][x][1]

    for (const [x2, y2] of arr) {
        let val = grid[y2][x2][0]

        if (sat.has(val)) {
            sat.delete(val)
        }
    }
    return sat
}

async function createRandomSudoku() {
    let sudoku = resetSudoku()

    while (!isSolved(sudoku)) {
        let min = 10
        let minPos

        for (let y = 0; y < sudoku.length; y++) {
            for (let x = 0; x < sudoku[y].length; x++) {
                if (sudoku[y][x][0] !== 0) { continue }
                
                sudoku[y][x][1] = possibleMoves(sudoku, y, x, sudoku[y][x][1])
                if (sudoku[y][x][1].size < min) {
                    min = sudoku[y][x][1].size
                    minPos = [x, y]
                }
            }
        }
        let [x, y] = minPos
        if (!sudoku[y][x][1].size) { sudoku = resetSudoku(); continue }

        let i = Math.floor(Math.random() * sudoku[y][x][1].size)
        sudoku[y][x][0] = getNthValueFromSet(sudoku[y][x][1], i)
        sudoku[y][x][1].clear()
    }
    return sudoku.map(r => r.map(e => e[0]))
}   

async function generateSudoku(difficulty) {
    let board = await createRandomSudoku()
    let solution
    let isDifferent = true

    while (isDifferent) {
        isDifferent = false
        let used = getUsed(board)

        while (used.length) {
            const i = Math.floor(Math.random() * used.length)
            const [y, x] = used[i]
            let t = board[y][x]
            board[y][x] = 0

            let finalBoard = board.map(row => row.map(cell => [cell, cell ? new Set() : new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])] ))
            finalBoard.forEach((row, y) => row.forEach((cell, x) => cell[1] = possibleMoves(finalBoard, y, x, cell[1])))

            solution = await solve(finalBoard, 'GENERATE', difficulty)
            used.pop(i)

            if (solution === false || solution[1] > difficulty) {
                board[y][x] = t
            } else { isDifferent = true }
        }
    }
    show(board)
    save()
    return board
}