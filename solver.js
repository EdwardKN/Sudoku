function isSolved(grid) {
    return grid.every(row => row.every(cell => cell.td.style.backgroundColor !== 'red' && cell.value))
}

function show(grid) {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].map(e => e.value).join(" "))
    }
    console.log("--------------------------")
}

function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) { return false }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) { return false }
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j].length !== arr2[i][j].length) { return false }
            for (let e = 0; e < arr1[i][j].length; e++) {
                if (arr1[i][j][e] !== arr2[i][j][e]) { return false }
            }
        }
    }
    return true
}

function copyProperty(arr, prop) {
    let temp = []
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
    let check = []
    // Vertical And Horizontal
    for (let i = 0; i < grid.length; i++) {
        if (i !== y) { check.push([i, x]) }
        if (i !== x) { check.push([y, i])}
    }
    // 3x3 Box
    let left = 3 * Math.floor(x / 3)
    let top = 3 * Math.floor(y / 3)
    for (let i = top; i < top + 3; i++) {
        for (let j = left; j < left + 3; j++) {
            if (grid[i][j].value != 0 && (i !== y && j !== x)) { check.push([i, j]) }
        }
    }
    
    for (let cell of check) {
        let y2 = cell[0]
        let x2 = cell[1]
        if (grid[y2][x2].value == number) {
            return {x:x2,y:y2}
        }
    }
    return true
}
async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms))}

function resetValues(grid) { for (let y = 0; y < grid.length; y++) { for (let x = 0; x < grid[y].length; x++) { grid[y][x].possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] }}}

async function solve(grid, depth = 1) {
    resetValues(grid)
    let iteration = 0
    let start = performance.now()

    while (grid.some(row => row.some(e => !e.value))) {
        if (performance.now() - start >= 100) { return grid }
        let temp = copyProperty(grid, "possibleValues")

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (isSolved(grid)) { return grid }                

                if (grid[y][x].locked) {
                    grid[y][x].possibleValues = []
                    if (y % 3 !== 0 && x % 3 !== 0) { continue }
                }

                // Get Valid Numbers
                for (let n of grid[y][x].possibleValues) {
                    if (!(isPossibleMove(grid, y, x, n) === true)) {
                        grid[y][x].possibleValues.splice(grid[y][x].possibleValues.indexOf(n), 1)
                    }
                }
                if (grid[y][x].possibleValues.length == 1) {
                    grid[y][x].value = grid[y][x].possibleValues[0]
                    grid[y][x].possibleValues = []
                }

                // Check Box for singular
                if (y % 3 !== 0 || x % 3 !== 0) { continue }
                let posUsed = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row = Math.floor(y / 3) * 3 + i
                        let col = Math.floor(x / 3) * 3 + j
                        let value = grid[row][col].value

                        if (value) { delete posUsed[value]; continue }
                        
                        for (let n of grid[row][col].possibleValues) { 
                            if (posUsed.hasOwnProperty(n)) {
                                posUsed[n].push([row, col])
                            }
                        }
                    }
                }
                
                Object.keys(posUsed).forEach(key => {
                    let positions = posUsed[key]

                    if (positions.length === 1) {
                        let pos = positions[0]
                        grid[pos[0]][pos[1]].value = key
                        grid[pos[0]][pos[1]].possibleValues = []
                    } else if (positions.length !== 0) {
                        // Horizontal
                        if (positions.every(e => e[0] === positions[0][0])) { // Same Y Value
                            let usedPositions = positions.map(e => e[1])
                            let newPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(e => !usedPositions.includes(e))
                            for (let pos of newPositions) {
                                let index = grid[positions[0][0]][pos].possibleValues.indexOf(parseInt(key))

                                if (index !== -1) {
                                    grid[positions[0][0]][pos].possibleValues.splice(index, 1)
                                }
                            }
                        }
                        // Vertical
                        if (positions.every(e => e[1] === positions[0][1])) { // Same Y Value
                            let usedPositions = positions.map(e => e[0])
                            let newPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(e => !usedPositions.includes(e))
                            for (let pos of newPositions) {
                                let index = grid[pos][positions[0][1]].possibleValues.indexOf(parseInt(key))

                                if (index !== -1) {
                                    grid[pos][positions[0][1]].possibleValues.splice(index, 1)
                                }
                            }
                        }
                    }
                })
            }
        }
        if (isEqual(temp, copyProperty(grid, "possibleValues"))) {
            updateTable()

            let n = 2

            if (depth <= 0) { return grid }
            while (n < 10) {
                let pV = copyProperty(grid, "possibleValues")
                let v = copyProperty(grid, "value")

                for (let i = 0; i < grid.length; i++) {
                    for (let j = 0; j < grid[i].length; j++) {

                        if (!grid[i][j].locked && grid[i][j].possibleValues.length === n) {
                            for (let e = 0; e < n; e++) {
                                grid[i][j].value = grid[i][j].possibleValues[e]
                                console.log(i, j, grid[i][j].possibleValues)
                                let way = await solve(grid, depth - 1)
                                console.log(depth)
                                show(way)
                                
                                if (isSolved(way)) { return way } else {
                                    // Remove value from possibleValues
                                    grid[i][j].possibleValues.splice(grid[i][j].value, 1)

                                    // Reset Values and PossibleValues
                                    for (let i = 0; i < grid.length; i++) {
                                        for (let j = 0; j < grid[i].length; j++) {
                                            grid[i][j].value = v[i][j]
                                            grid[i][j].possibleValues = pV[i][j].map(e => e)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                n++
            }
            depth++
        }
        iteration++
    }
    console.log(`It Took ${iteration} Iterations To Solve The Sudoku`)
    console.log(`It took ${performance.now() - start} milliseconds`)
    updateTable()
    return grid
}