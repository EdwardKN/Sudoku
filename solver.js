// 305 Milliseconds For Empty And 100 Milliseconds For Expert
// 120 Milliseconds For Empty And 24 Milliseconds For Expert

let fat = [
    [6, 3, 9, 2, 0, 0, 0, 7, 1],
    [0, 1, 2, 0, 0, 9, 0, 0, 5],
    [0, 7, 0, 0, 6, 0, 0, 0, 0],
    [4, 0, 0, 1, 8, 3, 0, 5, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0],
    [9, 0, 0, 7, 0, 5, 3, 2, 0],
    [1, 6, 0, 4, 0, 0, 0, 9, 3],
    [0, 9, 0, 5, 0, 0, 2, 4, 8],
    [2, 0, 5, 9, 3, 8, 6, 0, 7]
]



let f_base = [
    [9, 2, 7, 8, 1, 3, 4, 6, 5],
    [6, 8, 5, 7, 2, 4, 1, 3, 9],
    [1, 4, 3, 6, 5, 9, 7, 8, 2],
    [5, 7, 1, 9, 6, 8, 2, 4, 3],
    [4, 9, 6, 3, 7, 2, 5, 1, 8],
    [8, 3, 2, 1, 4, 5, 6, 9, 7],
    [3, 6, 4, 5, 9, 7, 8, 2, 1],
    [2, 5, 8, 4, 3, 1, 9, 7, 6],
    [7, 1, 9, 2, 8, 6, 3, 5, 4]
]

let f_solve = [
    [9, 2, 0, 8, 0, 3, 0, 6, 5],
    [6, 8, 5, 7, 0, 0, 1, 3, 0],
    [1, 4, 0, 6, 5, 0, 7, 8, 2],
    [5, 0, 1, 0, 6, 0, 0, 4, 3],
    [0, 9, 0, 3, 0, 0, 5, 1, 8],
    [8, 3, 0, 0, 4, 0, 6, 9, 0],
    [0, 0, 4, 5, 9, 0, 8, 0, 0],
    [0, 0, 0, 0, 3, 1, 0, 0, 0],
    [0, 0, 9, 0, 8, 0, 0, 5, 0]
]

const solved = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4],
    [3, 1, 2, 6, 4, 5, 9, 7, 8],
    [6, 4, 5, 9, 7, 8, 3, 1, 2],
    [9, 7, 8, 3, 1, 2, 6, 4, 5]
]

function isSolved(grid) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x][0] === 0 ) { return false }
        }
    }
    return true
}

function getValPos(grid) {
    const values = copyProperty(grid, "value")
    const temp = values.map(row => row.map(val => [val, val ? new Set() : 
        new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])]))
    return temp
}

function equalSets(set1, set2) { return set1.size === set2.size && [...set1].every((e) => set2.has(e)) }

function copyProperty(arr, prop) {
    const temp = []
    for (let i = 0; i < arr.length; i++) {
        temp.push([])
        for (let j = 0; j < arr[i].length; j++) {
            if (Array.isArray(arr[i][j][prop])) {
                temp[i].push([])
                for (let e of arr[i][j][prop]) { temp[i][j].push(e) }
            } else { temp[i].push(arr[i][j][prop]) }
        }
    }
    return temp
}

function isPossibleMove(grid, y, x, number) {
    for (const [y2, x2] of getAll(y, x)) {
        if (grid[y2][x2].value == number) { // Not Legal Move
            return {x:x2,y:y2}
        }
    }
    return true
}

function possibleMoves(grid, y, x, numbers) {
    for (const [y2, x2] of getAll(y, x)) {
        numbers.delete(grid[y2][x2][0])
    }
 
    return numbers
}

function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) { return false } // Length
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) { return false } // Length
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j][0] !== arr2[i][j][0] || // Value And Size
                !equalSets(arr1[i][j][1], arr2[i][j][1]))
                { return false }
        }
    }
    return true
}

function show(arr) { 
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            grid[i][j].value = arr[i][j]
            grid[i][j].locked = false
            if (arr[i][j]) { grid[i][j].locked = true }
        }
    }
    updateTable()
}

function notAnyPossibleMove(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!grid[y][x][0] && !grid[y][x][1].size) { // No Value and no possible value
                return false
            }
        }
    }
    return true
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

function getAll(y, x) {
    let positions = []
    // 0, 3, 6
    let y2 = Math.floor(y / 3) * 3
    let x2 = Math.floor(x / 3) * 3

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (y != y2 + i || x != x2 + j) {
                positions.push([y2 + i, x2 + j])
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        let boxI = Math.floor(i / 3) * 3
        if (i !== y && boxI !== y2) { positions.push([i, x]) }
        if (i !== x && boxI !== x2) { positions.push([y, i]) }
    }

    return positions
}

async function solve(grid, type, depth = 0) {
    let difficulty = 0
    while (!isSolved(grid)) {
        if (!notAnyPossibleMove(grid)) { return [[], difficulty] }
        let temp = structuredClone(grid)

        // All Cells With Only 1 Possible Value
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x][0] !== 0) { continue }

                grid[y][x][1] = possibleMoves(grid, y, x, grid[y][x][1])

                if (grid[y][x][1].size === 1) {
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    grid[y][x][1].delete(grid[y][x][0])
                    difficulty = Math.max(difficulty, 1)
                }
            }
        }
        
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                let posUsed = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row = 3 * y + i
                        let col = 3 * x + j

                        if (grid[row][col][0]) { delete posUsed[grid[row][col][0]]; continue }
                        
                        for (let n of grid[row][col][1]) {
                            if (posUsed.hasOwnProperty(n)) { posUsed[n].push([row, col]) }
                        }
                    }
                }
                
                // Check Length Of One
                Object.keys(posUsed).forEach(key => {
                    key = parseInt(key)
                    let positions = posUsed[key]

                    if (positions.length === 0) { return }
                    difficulty = Math.max(difficulty, 2)
                    if (positions.length === 1) {
                        let [y, x] = positions[0]
                        grid[y][x][1] = possibleMoves(grid, y, x, grid[y][x][1])
                        if (!grid[y][x][1].size) { return }
                        grid[y][x][0] = key
                        grid[y][x][1].clear()
                        return
                    }
                    // Check Horizontal
                    if (positions.every(e => e[0] === positions[0][0])) { // Same Y Value
                        let y = positions[0][0]
                        let used = new Set(positions.map(e => e[1])) // Get X Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i)) { grid[y][i][1].delete(key) }
                        }
                        return
                    }
                    // Check Vertical
                    if (positions.every(e => e[1] === positions[0][1])) { // Same X Value
                        let x = positions[0][1]
                        let used = new Set(positions.map(e => e[0])) // Get Y Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i)) { grid[i][x][1].delete(key) }
                        }
                    }
                })
            }
        }

        if (!isEqual(temp, grid)) { continue }
        difficulty = Math.max(difficulty, 3 + depth)

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x][0] !== 0) { continue }

                let result = []
                let possible = structuredClone(grid[y][x][1])
                grid[y][x][1].clear()

                for (let val of possible) {
                    grid[y][x][0] = val
                    let solutions = await solve(structuredClone(grid), type, depth + 1)

                    if (solutions[0].length === 0) { possible.delete(val); continue }
                    
                    if (type === 'SOLVE') {
                        return solutions 
                    } else if (type === 'GENERATE') {
                        solutions.forEach(solution => result.push(solution[0]))
                        if (result.length > 1) { return [result, difficulty] }
                    }
                }
                return [result, difficulty]
            }
        }
    }
    return [[grid], difficulty]
}

async function hint2(grid) {
    let curSolve = await solve(getValPos(grid))

    let overlaps = findOverlaps()

    let notUsed = grid.map(r => r.filter(cell => !cell.value))
    grid.forEach((row, i) => row.forEach((cell, j) => { if (!cell.value) { notUsed.push([i, j]) }}))

    if (notUsed.length === 0) { return }
    let [y, x] = notUsed[Math.floor(Math.random() * notUsed.length)]
    
    updateTable()
    gridHistory.push(JSON.parse(JSON.stringify(grid)))

    hintUsed = true
    if (isSolved(getValPos(grid))) {
        finished()
    } else {
        timerStop = false
    }
    save()
}

async function hint(grid) {
    let curSolve = await solve(getValPos(grid), true)
    curSolve = curSolve[0][0]
    let overlaps = []

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (curSolve[y][x][0] && !grid[y][x].value) {
                overlaps.push([y, x])
            }
        }
    }
    if (overlaps.length === 0) { alert("Någonting är fel börja om!"); return }
    let i = Math.floor(Math.random() * overlaps.length)
    let [y, x] = overlaps[i]
    grid[y][x].value = curSolve[y][x][0]

    // Idk
    updateTable()
    gridHistory.push(JSON.parse(JSON.stringify(grid)))

    hintUsed = true
    if (isSolved(getValPos(grid))) {
        finished()
    } else {
        timerStop = false
    }
    save()
}