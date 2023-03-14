async function solve(grid){
    resetValues(grid)

    let values = copyProperty(grid, "value")
    let possibleValues = copyProperty(grid, "possibleValues")
    let temp = values.map((row, y) => row.map((val, x) => [val, new Set(possibleValues[y][x])]))

    grid = await solve2(temp).then(e =>{
        e.forEach((row, i) => row.forEach((cell, j) => grid[i][j].value = cell[0]))
    });
    return grid
}
function resetValues(grid) { for (let y = 0; y < grid.length; y++) { for (let x = 0; x < grid[y].length; x++) { grid[y][x].possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] }}}

function equalSets(set1, set2) { return set1.size === set2.size && [...set1].every((e) => set2.has(e)) }

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

function possibleMoves(grid, y, x, numbers) {
    for (const [y2, x2] of getAll(y, x)) {
        numbers.delete(grid[y2][x2][0])
    }
    return numbers
}

function isEqual2(arr1, arr2) {
    if (arr1.length !== arr2.length) { return false }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) { return false }
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j][0] !== arr2[i][j][0] ||
                arr1[i][j][1].size !== arr2[i][j][1].size ||
                !equalSets(arr1[i][j][1], arr2[i][j][1]))
                { return false }
        }
    }
    return true
}

function anyPossibleMove(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!grid[y][x][0] && !possibleMoves(grid, y, x, grid[y][x][1]).size) {
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
    return Array.from(t).map(e => e.split(',').map(a => parseInt(a)))
}

// grid > rows > cell > [value, possibleValues]
async function solve2(grid) {
    let iteration = 0
    let memory = []
    let max_depth = 1
    let depth = 0
    let prevX = 0
    let prevY = 0

    while (grid.some(r => r.some(e => !e[0])) && iteration < 50) {    
        // Is There Any Tile With No Possible Values
        if (!anyPossibleMove(grid)) {
            if (memory.length === 0) { throw new Error("Fuck You This Shit Impossible")}
            let temp, value
            [temp, [prevY, prevX], value] = memory.pop()
            depth--
            grid = structuredClone(temp)
            grid[prevY][prevX][1].delete(value)
        }

        let temp = structuredClone(grid)

        // Loop through array
        let y = 0

        while (y < grid.length) {
            let x = 0

            while (x < grid[y].length) {
                if (grid[y][x][0] || grid[y][x].size === 0) { x++; continue }
                
                // Find Possible Moves
                grid[y][x][1] = possibleMoves(grid, y, x, grid[y][x][1])

                // Lonely
                if (grid[y][x][1].size === 1) {
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    grid[y][x][1].delete(grid[y][x][0])
                }

                // Box
                let posUsed = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row = Math.floor(y / 3) * 3 + i
                        let col = Math.floor(x / 3) * 3 + j

                        if (grid[row][col][0]) { delete posUsed[grid[row][col][0]]; continue }
                        for (let n of grid[row][col][1]) {
                            if (posUsed.hasOwnProperty(n)) { posUsed[n].push([row, col]) }
                        }
                    }
                }

                Object.keys(posUsed).forEach(key => {
                    key = parseInt(key)
                    let positions = posUsed[key]

                    if (positions.length === 0) { return }
                    if (positions.length === 1) {
                        let y = positions[0][0]
                        let x = positions[0][1]
                        grid[y][x][0] = key
                        grid[y][x][1].clear()
                    } else {
                        // Check Horizontal
                        if (positions.every(e => e[0] === positions[0][0])) { // Same Y Value
                            let y = positions[0][0]
                            let used = new Set(positions.map(e => e[1])) // Get X Values
                            for (let i = 0; i < 9; i++) {
                                if (!used.has(i)) { grid[y][i][1].delete(key) }
                            }
                        }
                        if (positions.every(e => e[1] === positions[0][1])) { // Same X Value
                            let x = positions[0][1]
                            let used = new Set(positions.map(e => e[0])) // Get Y Values
                            for (let i = 0; i < 9; i++) {
                                if (!used.has(i)) { grid[i][x][1].delete(key) }
                            }
                        }
                    }
                })
                x++
            }
            y++
        }


        if (isEqual2(temp, grid)) {

            if (depth >= max_depth) {
                depth--
                let temp, _
                [temp, [prevY, prevX], _] = memory.pop()
                grid = structuredClone(temp)
            }
            depth++
            n = 2

            outerloop: while(true) {
                for (let y = 0; y < grid.length; y++) {
                    for (let x = 0; x < grid[y].length; x++) {
                        if (y < prevY || (y === prevY && x <= prevX)) { continue }
                        if (grid[y][x][1].size === n) {
                            let value = grid[y][x][1].values().next().value
                     
                            memory.push([structuredClone(grid), [y, x], value]) // Store Old Grid
                                
                            grid[y][x][0] = value // Value To First Possible Value
                            grid[y][x][1].clear()
                            temp = structuredClone(grid)
                            depth++
                            break outerloop
                        }
                    }
                }
                n++
            }
        }
        iteration++
    }
    return grid
}

