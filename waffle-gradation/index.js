
function fn(dimensions, gradeCount) {
    const svgCanvas = svg.element('svg', {
        viewBox: `0, 0, ${dimensions.x}, ${dimensions.y}`,
        width: "97%",
        height: "100%"
    }, document.getElementById('container'))
    const gapTotal = dimensions.y * .2
    const gapHeight = gapTotal / (gradeCount.total + 1)
    const itemsTotal = dimensions.y - gapTotal
    const itemHeight = itemsTotal / gradeCount.total
    drawThem(gradeCount.total, '#FFF')
    drawThem(gradeCount.filled, '#6F86FF')

    function drawThem(index, color) {
        for (let itemIndex = 0; itemIndex < index; itemIndex += 1) {
            svg.element('rect', {
                width: dimensions.x * .9,
                height: itemHeight,
                x: 0,
                class: `grade-${itemIndex}`,
                y: dimensions.y - 0.01 - ((gapHeight * itemIndex) + (itemHeight * (itemIndex + 1))),
                style: `fill:${color};stroke:black;stroke-width:.003`,
            }, svgCanvas)
        }
    }
}

fn({ x: .5, y: 2 }, {
    total: 4,
    filled: 3}
)
