
/**
 * @example makeTimeline(['2018-11-01', '2018-11-07'], 20)
 * @param {array<string>} dates
 * @param 
 */

function makeTimeline (dates, number, title) {
    const container = dom.makeFromStr('div.book', document.body)
    dom.makeFromStr('p text=' + title, container)
    var svgCanvas = svg.element("svg", {
        viewBox: "0 0 1000 20"
    }, container)
    
    const width = Math.floor(1000 / number)
    for (let i = 0, even = false; i < 1000; i += width) {
        let style
        if (even === false) {
            style = 'fill: #EBFFE7'
            even = true
        } else {
            style = 'fill: #FFF4E5'
            even = false
        }
        svg.element('rect', {
            width: width,
            height: 20,
            x: i,
            y: 0,
            style: style
        }, svgCanvas)
    }
    
    for (let date of dates) {
        date = time.needISO(date)
        let daysAgo = time.datesBetween(date, new Date()).length - 1
        svg.element('rect', {
            y: 0,
            width: width,
            height: 20,
            x: 1000 - (width * daysAgo),
            style: 'fill: black'
        }, svgCanvas)
    }
}
