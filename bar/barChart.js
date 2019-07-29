'use strict'
/**
 * @param {object} obj
 * @param {object} options
 */
function makeBarChart(array, options, parent) {
const isStacked = Array.isArray(array && array[0] && array[0][0])
const svgCanvasOptions = {
    width: 1100,
    height: 700,
    margin: .1
}
const svgCanvas = svg.element("svg", {
    viewBox: `0 0 ${svgCanvasOptions.width} ${svgCanvasOptions.height}`,
    class: 'barchart',
    width: '100%',
    height: '100%'
}, parent)

//const itemWidth = .1

const itemWidth = Math.floor(
    (svgCanvasOptions.width / (array.length)) * (1 - svgCanvasOptions.margin)
)

const unitHeight = array.reduce((unitHeight, subArr) => {
    let total
    if (!isStacked) {
        total = subArr[1]
    } else {
        total = subArr.reduce((acc, subArrItem) => {
            return acc + subArrItem[1]
         }, 0)
    }
    let newUnitHeight = (svgCanvasOptions.height * .95) / total
    return newUnitHeight < unitHeight ? newUnitHeight : unitHeight

}, svgCanvasOptions.height)

array.reduce((xCoord, subArr) => {
    let yCoord = svgCanvasOptions.height * .995
    if (isStacked) {
        subArr.forEach(makeRectangle)
    } else {
        makeRectangle(subArr)
    }
    return xCoord + itemWidth * (1 + svgCanvasOptions.margin)

    function makeRectangle (array) {
        let cat = array[0]
        let value = array[1]
        let color = options.colors ? options.colors[cat] : '#25B500'
        if (value > 0) {
            svg.element('rect', {
                width: itemWidth,
                height: unitHeight * value,
                y:  yCoord - unitHeight * value,
                x: xCoord,
                class: `${cat}`,
                style: 'fill: ' + color
            }, svgCanvas)
        }

        yCoord -= unitHeight * value + 1
    }
}, svgCanvasOptions.width / 200)
}
