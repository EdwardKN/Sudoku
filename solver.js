// Call with: grid = solve(grid)

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

async function solve(grid) {
    let iteration = 0
    let start = performance.now()
    
    while (grid.some(row => row.some(e => !e.value))) {
        if (performance.now() - start >= 3000) { return grid }

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (![undefined, 0].includes(grid[y][x].value)) { continue }
                // Get Valid Numbers
                for (let n = 1; n <= 9; n++) {
                    if (!(isPossibleMove(grid, y, x, n) === true)) {
                        grid[y][x].possibleValues.splice(grid[y][x].possibleValues.indexOf(n), 1)
                    }
                }
                if (grid[y][x].possibleValues.length == 1) {
                    grid[y][x].value = grid[y][x].possibleValues[0]
                }
                grid[y][x].possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        }
        iteration++
    }
    console.log(`It Took ${iteration} Iterations To Solve The Sudoku`)
    console.log(`It took ${performance.now() - start} milliseconds`)
    updateTable()
    return grid
}