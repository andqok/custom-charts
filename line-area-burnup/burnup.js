'use strict'

/**
 *
 * @param {object} data
 * options ('area'|'line')
 * options.area ('stepped', 'half-stepped')
 */
function makeBurnupChart(data, colors, parent) {
    let i = 3

    let uniqYears = time.getUniqueYears(
            Object.keys(data)
        )
    let maxTotal = uniqYears.reduce((maxTotal, neededYear) => {

        let total = Object.keys(data).reduce((acc, date) => {

            let { year } = time.destructISO(date)
            if (neededYear === +year) {
                return acc + data[date]
            } else {
                return acc
            }
        }, 0)
        if (total > maxTotal) {
            return total
        } else {
            return maxTotal
        }
    }, 0)
    const svgCanvas = svg.element("svg", {
        viewBox: `0 0 368 ${(maxTotal + 10) / i}`,
        width: "97%",
        height: "100%"
    }, parent)
    uniqYears.forEach(year => {
        drawYear(year, colors[year])
    })

    function drawYear(yearNumber, color) {
        let localTotal = maxTotal
        const dates = time.getAllYearDates(yearNumber)
                          .map(date => time.needISO(date))
        const polyline = []
        dates.forEach( (date, xCoord) => {
            let value = data[date] || 0
            localTotal -= value
            let yCoord = (localTotal / i)
            polyline.push(xCoord + ',' + yCoord)
            if (xCoord === 362) {
                svg.text({
                    text: yearNumber,
                    x: xCoord - 15,
                    y: yCoord - 4,
                    class: 'year'
                }, svgCanvas)
            }
        })
        let painter = svg.polyPainter({
            'fill': 'none',
            'stroke': color,
            'stroke-width': .8
            }, svgCanvas)
        painter(polyline.join(' '))
    }
}
