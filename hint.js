async function hint(grid) {
    let solution = (await solve(getValPos(grid), 'SOLVE', Infinity))[0]
    let notUsed = []

    for (let y = 0; y < solution.length; y++) {
        for (let x = 0; x < solution[y].length; x++) {
            if (!grid.value) { notUsed.push([x, y]) }
        }
    }

    if (notUsed.length === 0) { return false }
    let i = Math.floor(Math.random() * notUsed.length)
    let [x, y] = notUsed[i]
    grid[y][x].value = solution[y][x][0]
    updateTable()
    gridHistory.push(JSON.parse(JSON.stringify(grid)))
    hintUsed = true
    save()
}