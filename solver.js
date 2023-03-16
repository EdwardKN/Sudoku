// 305 Milliseconds For Empty And 100 Milliseconds For Expert
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
            const pos = possibleMoves(grid, y, x, new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).size
            if (!grid[y][x][0]) {
                return false
            }
            if (!pos) { throw "Error Sudoku Is Invalid"}
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

async function solve(grid){
    const temp = getValPos(grid)

    grid = await solve2(temp).then(e =>{
        e.forEach((row, i) => row.forEach((cell, j) => grid[i][j].value = cell[0]))
    });
    return grid
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

function notAnyPossibleMove(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!grid[y][x][0] && !possibleMoves(grid, y, x, grid[y][x][1]).size) { // No Value and no possible value
                return false
            }
        }
    }
    return true
}

function getAll(y, x) {
    let t = new Set()
    for (let i = 0; i < 9; i++) { 
        if (i !== y) { t.add(`${i},${x}`) }
        if (i !== x) { t.add(`${y},${i}`)}
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let row = Math.floor(y / 3) * 3 + i
            let col = Math.floor(x / 3) * 3 + j
            if (!(row === y && col === x)) { t.add(`${row},${col}`) }
        }
    }
    return Array.from(t).map(e => e.split(',').map(a => parseInt(a))) // Return Array [[y, x]...]
}

async function solve2(grid) {
    let memory = []
    let iteration = depth = prevX = prevY = 0 // Depth For Difficulty

    while (!isSolved(grid)) {
        let temp = structuredClone(grid)

        // Is There Any Tile With No Possible Values
        if (!notAnyPossibleMove(grid)) {
            if (memory.length === 0) { throw new Error("Fuck You This Shit Impossible")}
            let temp, value, a
            [temp, [prevY, prevX], value] = memory.pop()
            depth--
            grid = structuredClone(temp)
            grid[prevY][prevX][1].delete(value)
        }

        // All Cells With Only 1 Possible Value
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x][0]) { continue }
                grid[y][x][1] = possibleMoves(grid, y, x, grid[y][x][1])

                if (grid[y][x][1].size === 1) {
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    grid[y][x][1].delete(grid[y][x][0])
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
                let keys = Object.keys(posUsed)
                // Check Length Of One
                keys.forEach(key => {
                    key = parseInt(key)
                    let positions = posUsed[key]

                    if (positions.length === 0) { return }
                    if (positions.length === 1) {
                        let [y, x] = positions[0]
                        grid[y][x][0] = key
                        grid[y][x][1].clear()
                        return
                    }
                    // Check Horizontal
                    if (positions.every(e => e[0] === positions[0][0])) { // Same Y Value
                        let y = positions[0][0]
                        let used = new Set(positions.map(e => e[1])) // Get X Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i)) { grid[y][i][1].delete(key); }
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

        if (!isEqual(temp, grid)) { iteration++; continue}

        n = 2
        
        outerloop: while(n <= 9) {
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    if (y < prevY || (y === prevY && x <= prevX)) { continue }
                    if (grid[y][x][1].size === n) {
                        let value = grid[y][x][1].values().next().value

                        memory.push([structuredClone(grid), [y, x], value]) // Store Old Grid
                            
                        grid[y][x][0] = value // Value To First Possible Value
                        grid[y][x][1].clear()
                        
                        depth++

                        break outerloop
                    }
                }
            }
            n++
        }
        iteration++
    }
    console.log(`It Took ${iteration} Iterations To Solve The Sudoku`)
    console.log(`It Recuired A Depth Of ${depth} To Solve The Sudoku`)
    return grid
}

async function generateSudoku(difficulty) {
    let grid = Array.from(Array(9), () => Array.from(Array(9)).fill(0))
    



    return grid
}

console.log(generateSudoku())
