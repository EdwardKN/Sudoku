// 2D array with dicts, .select.value


function possibleMove(grid, y, x) {
    // Check Box
    let top = 3 * Math.floor(y / 3)
    let left = 3 * Math.floor(x / 3)
    for (let i = top; i < top + 3; i++) {
        for (let j = left; j < left + 3; j++) {
            if (grid[y][x] !== grid[i][j] && grid[y][x].select.value === grid[i][j].select.value) {
                return false
            }
        }
    }
    // Check Vertical and Horizontal
    for (let i = 0; i < grid.length; i++) {
        if (grid[y][x] !== grid[i][j] && (grid[y][x].select.value === grid[i][x].select.value 
            || grid[y][x].select.value === grid[y][i].select.value)) {
            return false
        }
    }



    return true
}


function solve(grid) {

}
possibleMove(grid, 4, 4)