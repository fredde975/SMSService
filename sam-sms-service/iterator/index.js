
exports.iterator = function iterator (event, context, callback) {
    console.log(event)

    let index = event.iterator.index
    let step = event.iterator.step
    let count = event.iterator.count
    let nextDate = event.dates[index]

    index += step

    callback(null, {
        index,
        step,
        count,
        nextDate,
        continue: index < count
    })
}