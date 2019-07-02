var moment = require('moment');

exports.calculateDates = function calculateDates (event, context, callback) {
    //var duration = moment.duration({'days' : 2});
    //moment().add(Duration);

    var endDate = event.endDate //2019-07-14T01:59:00Z

    var endMoment = moment(endDate).subtract(2, 'minute');
    var startMoment = moment().add(2, 'minute');
    var duration = moment.duration(endMoment.diff(startMoment));
    var halfDuration = duration.asMilliseconds() / 2;
    var middleMoment = startMoment.clone().add(halfDuration, 'milliseconds');

    //todo should always set the time 12.00 in order not send messages in the middle of the night

    console.log("endDate = ", endDate);
    console.log("endMoment = ", endMoment);
    console.log("startMoment = ", startMoment);
    console.log("halfDuration millis = ", halfDuration);
    console.log("middleMoment = ", middleMoment);

    var result = [startMoment, middleMoment, endMoment]

    var now = moment();
    var first = moment().add(1, "minute");
    var second =  moment().add(2, "minute");
    var third =  moment().add(3, "minute");

//    var result = [first , second, third];

    //callback(null, {result})
    callback(null, result)
}