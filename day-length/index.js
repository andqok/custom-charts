'use strict'

function visualizeDays(area, startDate, endDate) {
    const viewWidth = 366
    var dayWidth
    const viewHeight = 144
    const minuteHeight = viewHeight / 1440
    const areas = {
        "rivne": [50.62, 26.23]
    }
    dom.removeAllChildren(query('.wrp'))

    const svgCanvas = svg.element("svg", {
        viewBox: `0 0 ${viewWidth} ${viewHeight + 2}`
    }, query('.wrp'))

    const datesBetween = time.datesBetween(startDate, endDate)
    dayWidth = viewWidth / datesBetween.length
    todayLine()
    makeBound('sunrise')
    makeBound('sunset')
    makeHoursLines()

    function todayLine() {
        let now = new Date()
        const calc = SunCalc.getTimes(now, ...areas[area])

        svg.element('rect', {
            width: dayWidth,
            height: viewHeight,
            x: (time.datesBetween(startDate, now).length - 1) * dayWidth,
            y: 0,
            style: 'fill: pink'
        }, svgCanvas)
    }
    /**
     * Write to svg sunrise-sunset bound for every day
     */
    function makeBound(what) {
        var x = 0
        //var y = 23
        for (let /** Date */ date of datesBetween) {
            const calc = SunCalc.getTimes(date, ...areas[area])
            svg.element('rect', {
                width: dayWidth,
                height: 1,
                x: x,
                id: calc[what].getHours() + ':' + calc[what].getMinutes(),
                y: getY(calc[what]) / 10,
                style: 'fill: blue'
            }, svgCanvas)
            /** Boundaries between weeks */
            if (date.getDay() === 1) {
                svg.polyPainter({
                    'fill': 'none',
                    'stroke': 'grey',
                    'stroke-width': .2
                }, svgCanvas)
                (`${x},${0} ${x},${viewHeight}`)
            }
            x += dayWidth
        }
    }

    /**
     * Horizontal lines between every hour
     */
    function makeHoursLines() {
        let /** function */ makePolyline = svg.polyPainter({
            'fill': 'none',
            'stroke': 'grey',
            'stroke-width': .2
        }, svgCanvas)
        for (let i = 1; i <= 24; i += 1) {
            let x0 = 0
            let x1 = viewWidth
            let y = i * 60 * minuteHeight
            makePolyline(`${x0},${y} ${x1},${y}`)
            let hoursText = svg.element('text', {
                y: y, //- (viewHeight / 20),
                x: x0,
                class: 'hours'
            }, svgCanvas)
            hoursText.appendChild(
                document.createTextNode(24 - i)
            )
        }
    }

    function getY(date) {
        let naive = date.getHours() * 60 + date.getMinutes()
        return 1440 - naive
    }
}
