function notAnyPossibleMove(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!grid[y][x][0] && !grid[y][x][1].size) {
                return false
            }
        }
    }
    return true
}

function isSolved(grid) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (grid[y][x][0] === 0) { return false }
        }
    }
    return true
}

function deleteFromAdjacent(grid, x, y, n) {
    for (let [x2, y2] of getAll(x, y)) {
        if (grid[y2][x2][1].has(n)) { grid[y2][x2][1].delete(n) }
    }
}

function getAll(x, y) {
    let positions = []
    let y2 = Math.floor(y / 3) * 3
    let x2 = Math.floor(x / 3) * 3

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (y != y2 + i || x != x2 + j) {
                positions.push([x2 + j, y2 + i])
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        let boxI = Math.floor(i / 3) * 3
        if (i !== y && boxI !== y2) { positions.push([x, i]) }
        if (i !== x && boxI !== x2) { positions.push([i, y]) }
    }

    return positions
}

function deepClone(grid) {
    let temp = []
    for (let y = 0; y < grid.length; y++) {
        temp.push([])
        for (let x = 0; x < grid[y].length; x++) {
            temp[y].push([grid[y][x][0], new Set(Array.from(grid[y][x][1]))])
        }
    }
    return temp
}

function resetSet(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            possibleMoves(grid, y, x)
        }
    }
}

async function solve(grid, type, maxDifficulty) {
    resetSet(grid)
    let difficulty = 0
    let mem = []
    let solution = undefined

    while (true) {
        let solved = isSolved(grid)
        let possibleMoves = !notAnyPossibleMove(grid)

        if (solved || possibleMoves) {
            if (solved) {
                if (mem.length === 0 || type === 'SOLVE') { break }
                if (solution !== undefined) { return false }
                solution = deepClone(grid)
            } else if (mem.length === 0) { throw new Error("NOT POSSIBLE")}

            let prev = mem.pop()
            grid = prev[0]
            let x = prev[1]
            let y = prev[2]
            let val = prev[3]            
            grid[y][x][1].delete(val)
            val = grid[y][x][1].values().next().value
            
            if (grid[y][x][1].size === 0) { break }
            if (solved || (possibleMoves && grid[y][x][1].size > 1)) { mem.push([deepClone(grid), x, y, val])}
            
            grid[y][x][0] = val
            deleteFromAdjacent(grid, x, y, val)
        }


        let changed = false
        // Only 1 Option
        let prev = []

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x][0]) { continue }
                if (prev.length === 0) { prev = [x, y] }

                if (grid[y][x][1].size === 1) {
                    changed = true
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    deleteFromAdjacent(grid, x, y, grid[y][x][0])
                    x = prev[0] - 1
                    y = prev[1]
                }
            }
        }

        if (changed) { continue }
        if (maxDifficulty === 1) { return false }
        changed = false

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                let removed = new Set()
                let posUsed = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] }
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row = 3 * y + i
                        let col = 3 * x + j
        
                        if (grid[row][col][0]) { removed.add(grid[row][col][0]); continue }
                                
                            for (let n of grid[row][col][1]) {
                               posUsed[n].push([row, col])
                            }
                    }
                }
                        
                // Check Length Of One
                Object.keys(posUsed).forEach(key => {
                    key = parseInt(key)
                    if (removed.has(key)) { return }
        
                    let positions = posUsed[key]
        
                    if (positions.length === 0) { return }

                    if (positions.length === 1) {
                        let [y, x] = positions[0]
                        if (!grid[y][x][1].size) { return }
                        grid[y][x][0] = key
                        grid[y][x][1].clear()
                        deleteFromAdjacent(grid, x, y, key)
                        changed = true
                        return
                    }
                    // Check Horizontal
                    if (positions.every(e => e[0] === positions[0][0])) { // Same Y Value
                        let y = positions[0][0]
                        let used = new Set(positions.map(e => e[1])) // Get X Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i) && grid[y][i][1].has(key)) { grid[y][i][1].delete(key); changed = true }
                        }
                        return
                    }
                    // Check Vertical
                    if (positions.every(e => e[1] === positions[0][1])) { // Same X Value
                        let x = positions[0][1]
                        let used = new Set(positions.map(e => e[0])) // Get Y Values
                        for (let i = 0; i < 9; i++) {
                            if (!used.has(i) && grid[i][x][1].has(key)) { grid[i][x][1].delete(key); changed = true }
                        }
                    }
                })
            }
        }

        if (changed) { continue }
        if (maxDifficulty === 2) { return false }

        difficulty = Math.max(difficulty, 3 + mem.length)
        let min = 10
        let minPos = []

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x][0] === 0 && grid[y][x][1].size < min) {
                    minPos = [x, y]
                    min = grid[y][x][1].size
                }
            }
        }

        let [x, y] = minPos
        let val = grid[y][x][1].values().next().value
        mem.push([deepClone(grid), x, y, val])
        grid[y][x][0] = val
        deleteFromAdjacent(grid, x, y, val)
    }
    return [[grid], difficulty]
}
