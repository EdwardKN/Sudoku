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