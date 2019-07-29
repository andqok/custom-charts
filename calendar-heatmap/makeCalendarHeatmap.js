'use strict'

function makeCalendarHeatmap(days, options, parent) {
    const cell    = 16
    const gutter  = 2
    const offsetX = 20
    const borderOptions = options.border || {
        'fill': 'none',
        'stroke': '#61C47E',
        'stroke-width': 2
    }

    if (Array.isArray(days)) {
        days = daysToObj(days)
    }

    /** needed to calculate year's offset on Y axis */
    let uniqueYears = time.getUniqueYears( Object.keys(days) )

    /**
     * Create main element svg and its container (which is needed for responsive)
     */
    var svgCanvas = svg.element("svg", {
        viewBox: "0 0 1000 " + (200 * uniqueYears.length)
    }, parent)

    for (let date in days) {
        let /** string */ { year } = time.destructISO(date)
        let /** number */ offsetY = 200 * (uniqueYears.indexOf(+year))
        let cell = renderCell(...getCellCoords(date, offsetY),
            date, getCellColor(days[date])
        )
    }

    for (let year of uniqueYears) {
        drawYearBorders(year, 200 * (uniqueYears.indexOf(year)))
    }
    //parent.appendChild(
    //    svgCanvas
    //)

    function getCellColor(mark) {
        if (options.singleColor) {
            return options.singleColor
        }
        if (Array.isArray(mark)) {
            mark = mark.length
        }
        let {colors, field} = options
        colors = colors || {
            '0': '#FCFFF3',
            '1': '#B1E6FF',
            '2': '#55AEFF',
            '3': '#1A7DFF',
            '4': '#1A47FF'
        }
        if (field) {
            return colors[mark[field]]
        }
        return colors[mark]
    }

    function daysToObj(days) {
        let res = {}
        for (let pair of days) {
            res[time.ISOfyDate(pair[0])] = pair[1]
        }
        return res
    }

    /**
     * Actually write out individual cell to svg
     * @param {number} coordX
     * @param {number} coordY
     * @param {string} date  — ISO 8601
     * @param {string} color — hex
     * @return rendered cell
     */
    function renderCell(coordX, coordY, date, color) {
        color = color || '#fff'
        return svg.element("rect", {
            class: "r",
            width: cell,
            height: cell,
            id: date,
            x: coordX + offsetX,
            y: coordY,
            style: `fill: ${color}`,
        }, svgCanvas)
    }

    /**
     * Draw borders between months, as well as top and bottom border
     * of each year.
     * @param {string|number} year
     * @param {number} y offset
     *
     */
    function drawYearBorders(year, y) {
        let /** array */ dates = time.getAllYearDays(year)
            .map(i => time.ISOfyDate(i))
        /** draw left border of first month */
        let leftBorder = border(
            dates.slice(0, 7), 'left', y )
        let rightBorder
        /** draw right border of each month */
        for (let i = 1; i <= 12; i += 1) {
            let month = String(i).padStart(2, '0')
            drawMonth(year, month, y)
            let daysInMonth = time.daysCountInMonth({
                year: year,
                month: month
                }
            )
            let index0 = dates.indexOf(`${year}-${month}-${daysInMonth - 6}`)
            let index1 = dates.indexOf(`${year}-${month}-${daysInMonth}`) + 1
            let sliced = dates.slice(index0, index1)
            rightBorder = border(sliced, 'right', y - 1, svgCanvas)
        }
        //console.log(leftBorder, rightBorder)
        const poly = svg.polyPainter(borderOptions, svgCanvas)
        poly(`${leftBorder[0].x},${ leftBorder[0].y} ${
               rightBorder[0].x},${rightBorder[0].y}`)
        poly(`${leftBorder[1].x},${ leftBorder[1].y} ${
               rightBorder[1].x},${rightBorder[1].y}`)

        /** draw year */
        let coords = getCellCoords(`${year}-12-31`, y)
        svg.text({
            x: coords[0] - 23,
            y: y - 10,
            text: year
        }, svgCanvas)
    }

    function drawMonth (year, month, yOffset) {
        let date = `${year}-${month}-15`
        let coords = getCellCoords(date, yOffset)
        svg.text({
            x: coords[0] + 23,
            y: yOffset + 10,
            text: time.monthsNamesShort[month]
        }, svgCanvas)
    }

    /**
     * Find 4 points which constitute month border
     * @param {array} arr — individual days, ISO 8601
     * @param {string} lr — "left" or "right"
     * @param {number} y — Y axis offset
     * @return {array<object>} — coordinates of top and bottom points (Y axis)
     */
    function border(arr, lr, y) {
        let arr1 = getBorderCoords(arr, lr, y)
        let arr2 = arr1.join(' ')
        let arr3 = arr2.split(' ')

        /** two points constitute horizontal line */
        let point1 = {
            x: arr3[0].split(',')[0] - 1 + offsetX,
            y: arr3[0].split(',')[1],
        }
        let point2 = {
            x: arr3[arr3.length - 1].split(',')[0] - 1 + offsetX,
            y: arr3[arr3.length - 1].split(',')[1],
        }

        /**
         * next two points are identical on x axis to point1 and point2,
         * the difference is is on y axis: maximum and minimum value
         */
        let yRange = arr3.map(i => {
            let _y = +i.split(',')[1]
            return _y
        }).sort((x, y) => x - y)

        let point0 = {
            x: point1.x,
            y: yRange[yRange.length - 1],
        }
        let point3 = {
            x: point2.x,
            y: yRange[0],
        }
        let str = [point0, point1, point2, point3].map(i =>
            `${i.x},${i.y}`
        ).join(' ')
        svg.polyPainter(borderOptions, svgCanvas, str)
        return [point0, point3]
    }
    function getCellCoords(date, yOffset) {
        yOffset = yOffset || 0
        let week = time.getWeekNumber(new Date(date))
        let dayOfWeek = (new Date(date)).getDay()
        if (dayOfWeek === 0) dayOfWeek = 7

        let x = week * (cell + gutter)
        let y = dayOfWeek * (cell + gutter) + yOffset

        return [x, y]
    }
    /**
     * Get coordinates for individual cell's border.
     * @param {array} slice
     * @param {string} leftOrRight — which side of the cell is the border
     * @param {number} yOffset
     * @param {number} dayOfWeek
     * Typically leftOrRight === 'right' for all month's border,
     * left only for left border of the first month.
     */
    function getBorderCoords(slice, leftOrRight, yOffset) {
        let arr = slice.map(/** string */ date => {
            let /** array */ coords = getCellCoords(date, yOffset)
            let x = coords[0]
            let y = coords[1]
            if (leftOrRight === 'left') {
                return `${x},${y} ${x},${y + cell + gutter}`
            }
            if (leftOrRight === 'right') {
                return `${x + cell + gutter},${y} ${
                          x + cell + gutter},${y + cell + gutter}`
            }
        })
        return arr
    }
}
