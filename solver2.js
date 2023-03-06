async function solveSolve2(grid){
    resetValues(grid)

    let values = copyProperty(grid, "value")
    let possibleValues = copyProperty(grid, "possibleValues")
    let temp = values.map((row, y) => row.map((val, x) => [val, new Set(possibleValues[y][x])]))

    grid = await solve2(temp).then(e =>{
        e.forEach((row, i) => row.forEach((cell, j) => grid[i][j].value = cell[0]))
        updateTable()
    });
}

function showPv(grid) {
    for (let i = 0; i < 9; i++) { console.log(`Row: ${i + 1}`, grid[i].map(e => Array.from(e[1]).join(' ')))}
}

function show2(grid) {
    for (let i = 0; i < 9; i++) { console.log(grid[i].map(e => e[0]).join(' '))}
}

function possibleMoves(grid, y, x, numbers) {
    // Get all squares
    let visited = new Set()
    for (let i = 0; i < 9; i++) {
        if (!visited.has(`${i},${x}`)) {
            visited.add(`${i},${x}`)
        }
        if (!visited.has(`${y},${i}`)) {
            visited.add(`${y},${i}`)
        }
    }
    let top = Math.floor(y / 3) * 3
    let left = Math.floor(x / 3) * 3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!visited.has(`${top + i},${left + j}`)) {
                visited.add(`${top + i},${left + j}`)
            }
        }
    }
    for (let coords of visited) {
        coords = coords.split(',')
        let y = coords[0]
        let x = coords[1]
        numbers.delete(grid[y][x][0])
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
                ![...arr1[i][j][1]].every((x) => arr2[i][j][1].has(x)))
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

// grid > rows > cell > [value, possibleValues]
async function solve2(grid) {
    let iteration = 0
    let history = []
    let max_depth = 1
    let depth = 0


    while (grid.some(r => r.some(e => e[1].size)) && iteration < 50) {    
        // Is There Any Tile With No Possible Values
        if (history.length !== 0 && !anyPossibleMove(grid)) {
            console.log("Special End")   
            let [temp, [y, x], value] = history.pop()
            
            if (x === 8 && y === 8) {
                max_depth++
            }
            depth--
            grid = structuredClone(temp)
            grid[y][x][1].delete(value)
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

                if (grid[y][x][1].size === 1) {
                    grid[y][x][0] = grid[y][x][1].values().next().value
                    grid[y][x][1].delete(grid[y][x][0])
                }

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
                    let positions = posUsed[key]
                    key = parseInt(key)

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
            if (depth <= max_depth) {
                
                let [t, [y, x], val] = history.pop()


                if (x === 0 && y === 0) {
                    max_depth++
                }
                depth--
                grid = structuredClone(t)
                grid[y][x][1].delete(val)
                
            } else {
                console.log("Special")
                depth++
                n = 2
                outerloop: while(true) {
                    for (let y = 0; y < grid.length; y++) {
                        for (let x = 0; x < grid[y].length; x++) {
                            if (grid[y][x][1].size === n) {
                                let value = grid[y][x][1].values().next().value
                         
                                history.push([structuredClone(grid), [y, x], value]) // Store Old Grid

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
        }

        iteration++
    }
    console.log(iteration)
    showPv(grid)
    return grid
}