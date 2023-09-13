async function test(iterations, difficulty) {
    let totalTime = 0
    for (let i = 0; i < iterations; i++) {
        let s = performance.now()
        let g = await generateSudoku(difficulty)
        totalTime += performance.now() - s
        show(g)
        await sleep(0)
    }
    return totalTime / iterations
}

async function testTest(iterations, difficulty) {
    test(iterations, difficulty).then(e => console.log(`${e}`.split(".")[0] + " milliseconds"))
}