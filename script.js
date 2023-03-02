const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/*var grid = [
    [["a", 1], ["a", 2], null, ["c", 3]],
    [["b", 4], ["b", 5], ["b", 6], null],
    [["a", 7], null, null, ["d", 8]],
    [null, ["e", 9], null, ["d", 10]],
]*/

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms))}

async function animate() {
    console.clear()
    console.table(grid)

    await sleep(2000)
    bfs()
    await sleep(10000)
    requestAnimationFrame(animate)
}

function bfs(arr) {
    let connected = []
    let queue = []
    let visited = new Set()

    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            if (arr[y][x] === null || visited.has(`${y},${x}`)) { continue } // Already visited or null
            queue.push([y, x]) // Add to queue
            visited.add(`${y},${x}`) // Add to visited
            connected.push([]) // Add new Array
            connected[connected.length - 1].push(arr[y][x]) // Add to connected

            while (queue.length > 0) {
                let [y, x] = queue.shift() // Get x, y
                
                for (const [x2, y2] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { // Up, Down, Left, Right
                    let x3 = x + x2 // New x
                    let y3 = y + y2 // New y
                    if (
                        x3 < 0 || y3 < 0 || x3 >= arr.length || y3 >= arr.length || 
                        arr[y3][x3] === null || visited.has(`${y3},${x3}`) ||
                        arr[y3][x3][0] !== connected[connected.length - 1][0][0]
                    ) { continue } else {
                        queue.push([y3, x3]) // Add to queue
                        visited.add(`${y3},${x3}`) // Add to visited
                        connected[connected.length - 1].push(arr[y3][x3]) // Add to connected
                    }
                }
            }
        }
    }
    return connected
}

function deepCopy(arr) {
    let copy = []
    for (let i = 0; i < arr.length; i++) {
        copy.push([])
        for (let j = 0; j < arr[i].length; j++) {
            copy[i].push(arr[i][j])
        }
    }
    return copy
}

function createGrid(w = 0, h = 0) {
    let grid = Array.from(Array(h), () => Array.from(Array(w)).fill(null))
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    let prev
    for (let row = 0; row < h; row++) {
        let weight = 1
        for (let col = 0; col < w; col++) {
            if (Math.random() * weight > 0.5) {
                let r = Math.floor(Math.random() * letters.length)
                if (prev && Math.random() > 0.3) {
                    r = letters.indexOf(prev)
                }
                let letter = letters[r]
                grid[row][col] = letter
                weight += 0.1
                prev = letter
            } else { grid[row][col] = null; weight = 1 }
        }            
    }
    console.table(grid)
    return grid
}
//console.log(bfs(createGrid(5, 5)))
function count(arr, t) {
    let res = 0
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res += count(arr[i], t)
        } else if (arr[i] === t) { res++ }
    }
    return res
}

function isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) { return false }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) { return false }
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) { return false }
        }
    }
    return true
}

function includesArray(mainArr, testArr) {
    for (let arr of mainArr) {
        if (isEqual(arr, testArr)) {
            return true
        }
    }
    return false
}


// 1 1 2 1 1 {X och Y}
function testing(grid) {
    if (count(grid, null) == 0) { return [grid] }
    let grids = []
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] == null) {
                grid[y][x] = 0
                let b1 = testing(deepCopy(grid))
                grid[y][x] = 1
                let b2 = testing(deepCopy(grid))
                b1.forEach(e => { if (!includesArray(grids, e)) {grids.push(e) }})
                b2.forEach(e => { if (!includesArray(grids, e)) {grids.push(e) }})
                grid[y][x] = null
            }
        }
    }
    return grids
}

console.log(testing(
[
    ['a', null, 'a'],
    [null, 'a', null],
    ['a', null,'a']
]))

/*
options ** count(grid, null)
*/