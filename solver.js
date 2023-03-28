// 305 Milliseconds For Empty And 100 Milliseconds For Expert
// 120 Milliseconds For Empty And 24 Milliseconds For Expert
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
            const pos = possibleMoves(grid, y, x, new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])).size
            if (!grid[y][x][0] || !pos) {
                return false
            }
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
        e[0][0].forEach((row, i) => row.forEach((cell, j) => grid[i][j].value = cell[0]))
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
    let t = new Set()
    for (let i = 0; i < 9; i++) { 
        if (i !== y) { t.add(`${i},${x}`) }
        if (i !== x) { t.add(`${y},${i}`)}
    }
    let y2 = Math.floor(y / 3) * 3
    let x2 = Math.floor(x / 3) * 3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!(y2 + i === y && x2 + j === x)) { t.add(`${y2 + i},${x2 + j}`) }
        }
    }
    return Array.from(t).map(e => e.split(',').map(a => parseInt(a))) // Return Array [[y, x]...]
}

async function solve2(grid, print = true, showy = false) {
    let s = performance.now()
    let memory = []
    let difficulty = 0
    let max_depth = 1
    let iteration = depth = prevX = prevY = 0 // Depth For Difficulty

    while (!isSolved(grid)) {
        iteration++

        // Is There Any Tile With No Possible Values
        
        if (!notAnyPossibleMove(grid)) {
            if (memory.length === 0) { throw new Error("Fuck You This Shit Impossible")}
            let t, value
            [t, [prevY, prevX], value] = memory.pop()
            depth--
            grid = structuredClone(t)
            grid[prevY][prevX][1].delete(value)
        }
        let temp = structuredClone(grid)

        // All Cells With Only 1 Possible Value
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x][0]) { continue }
                
                grid[y][x][1] = possibleMoves(grid, y, x, grid[y][x][1])

                if (grid[y][x][1].size === 1) {
                    if (difficulty < 1) { difficulty = 1 }
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    grid[y][x][1].delete(grid[y][x][0])
                }
            }
        }
          
        
        if (showy) { show(grid.map(e => e.map(c => c[0]))); await sleep(100) }
        
        
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
                        if (difficulty < 2) { difficulty = 2 }
                        let y = positions[0][0]
                        let used = new Set(positions.map(e => e[1])) // Get X Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i)) { grid[y][i][1].delete(key); }
                        }
                        return
                    }
                    // Check Vertical
                    if (positions.every(e => e[1] === positions[0][1])) { // Same X Value
                        if (difficulty < 2) { difficulty = 2 }
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
        n = 2
        
        outerloop: while(n <= 9) {
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {

                    if (grid[y][x][1].size === n) {
                        if (difficulty < 3) { difficulty = 3 }
                        
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
    }
    if (print) {
        console.log(`It Took ${iteration} Iterations To Solve The Sudoku`)
        console.log(`It Recuired A Depth Of ${depth} To Solve The Sudoku`)
        console.log(`Average Iteration Speed: ${(performance.now() - s) / iteration} Milliseconds Per Iteration`)
    }
    return [[grid], difficulty]
}


function hint(solution) {
    let notUsed = []
    grid.forEach((row, i) => row.forEach((cell, j) => { if (!cell.value) { notUsed.push([i, j]) }}))
    if (notUsed.length === 0) { return }
    let [y, x] = notUsed[Math.floor(Math.random() * notUsed.length)]

    grid[y][x].value = solution[y][x][0]
    updateTable()
    gridHistory.push(JSON.parse(JSON.stringify(grid)));
    save();
}


async function hintHint() {
    let solve = await solve2(getValPos(grid))
    hint(solve[0][0])
}