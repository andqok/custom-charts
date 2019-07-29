/**
 * Inspired by: https://medium.com/@heyoka/scratch-made-svg-donut-pie-charts-in-html5-2c587e935d72
 * @example doDonut([7, 20, 30, 9, 17], document.body)
 * @todo Object.assign or Object.create?
 */
function doDonut(arr, parent) {
    const colors = [  '#3366cc', '#dc3912', '#ff9900', '#0f9d58', '#990099', '#a8a8a8']
    const typicalObj = {
        cx: 21,
        cy: 21,
        r: 15.91549430918954,
    }

    const svgCanvas = svg.element("svg", {
        width: "100%",
        height: "100%",
        viewBox: "0 0 42 42",
        class: "donut",
    }, parent)

    svg.element("circle", Object.assign(typicalObj, {
        class: "donut-ring",
        fill: "#fff"
    }), svgCanvas)

    arr.reduce((prevOffset, currPercent) => {
        svg.element("circle", Object.assign(typicalObj, {
            class: "donut-segment",
            fill: "transparent",
            stroke: colors.shift(),
            'stroke-width': 6,
            'stroke-dasharray': `${currPercent} ${100 - currPercent}`,
            'stroke-dashoffset': `${100 - prevOffset + 25}`
        }), svgCanvas)
        return prevOffset + currPercent
    }, 0)
  }

/**
 * Inspired by: https://hackernoon.com/a-simple-pie-chart-in-svg-dbdd653b6936
 * @example: makePie([
     { percent: 0.01, color: '#00ab6b' },
    { percent: 0.3, color: 'Coral' },
    { percent: 0.5, color: 'CornflowerBlue' },
], document.body)
*/
function makePie(slices, parent) {
    slices.sort( (obj1, obj2) => {
        return obj1.percent - obj2.percent
    })
    const svgEl = svg.element("svg", {
        width: "100%",
        height: "100%",
        viewBox: "-1 -1 2 2",
        class: "donut",
    }, parent)

    slices.reduce( (cumulativePercent, slice) => {
        /** start and end coordinates */
        const /** object */ start = getCoordinatesForPercent(cumulativePercent)
        const /** object */ end   = getCoordinatesForPercent(cumulativePercent + slice.percent)

        // if the slice is more than 50%, take the large arc (the long way around)
        const largeArcFlag = slice.percent > .5 ? 1 : 0

        // thickness for donut chart
        const thickness = .7

        const pathData = [
            `M ${start.x} ${start.y}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, // Arc
            // next two lines for donut chart
            //`L 0 0`
            `L ${end.x * thickness} ${end.y * thickness}`, // Line
            `A ${thickness} ${thickness} 0 ${largeArcFlag} 0 ${
                start.x * thickness} ${start.y * thickness}`,
        ]

        svg.element('path', {
            d: pathData.join(' '),
            fill: slice.color,
            //transform: 'rotate(-90deg)'
        }, svgEl)

        // each slice starts where the last slice ended, so keep a cumulative percent
        return cumulativePercent + slice.percent
    }, 0)

    return svgEl

    /**
     * https://en.wikipedia.org/wiki/Unit_circle
     */
    function getCoordinatesForPercent(percent) {
        return {
            x: Math.cos(2 * Math.PI * percent),
            y: Math.sin(2 * Math.PI * percent)
        }
    }
}
