"use strict";
exports.__esModule = true;
var fs = require("fs");
var moment = require("moment");
var argv = process.argv;
var usage = "Usage: node weekly-generator.ts <start-date> <end-date>";
if (argv.length !== 4) {
    console.log(usage);
    process.exit(1);
}
var date_to_props = function (date) {
    var name_of_day = [
        "",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
        "일요일",
    ];
    var day_of_week_mod = (parseInt(date.format("d"))) === 0 ? 7 : parseInt(date.format("d"));
    var year = date.format("YYYY");
    var month = date.format("YYYY/MM");
    var week_number = date.format("WW");
    var date_of_day_by_week = date.format("YYYY/[W]WW-" + day_of_week_mod.toString());
    var day_of_week = name_of_day[day_of_week_mod];
    return { year: year, month: month, week_number: week_number, date_of_day_by_week: date_of_day_by_week, day_of_week: day_of_week };
};
var createWeekBody = function (date) {
    // if day is not monday, return empty string
    if (date.format("d") !== "1") {
        return "";
    }
    var props = date_to_props(date);
    var properties = "start-at:: [[".concat(date.format("YYYY/MM/DD"), "]]\nend-at:: [[").concat(moment(date).add(6, "days").format("YYYY/MM/DD"), "]]\nmonth:: [[").concat(moment(date).add(3, "days").format("YYYY/MM"), "]]\n");
    var date_by_weeks = [];
    // end of week
    var end_of_week = moment(date).add(7, "days");
    while (date.isBefore(end_of_week)) {
        date_by_weeks.push(date_to_props(date).date_of_day_by_week);
        date.add(1, "days");
    }
    console.log(date_by_weeks);
    var body = "".concat(properties, "\n- ### \uD55C \uC8FC \uACC4\uD68D\n- ### \uC77C\uBCC4 \uC694\uC57D\n").concat(date_by_weeks.map(function (date_of_day_by_week) {
        return "- [[".concat(date_of_day_by_week, "]]");
    }).join("\n"), "\n- ### \uD55C \uC8FC \uD68C\uACE0\n  ");
    return body;
};
// from start date to end date
var start = moment(argv[2]);
var end = moment(argv[3]);
var dates = [];
while (start.isBefore(end)) {
    dates.push(start.format("YYYY-MM-DD"));
    start.add(1, "days");
}
dates.forEach(function (date) {
    // continue if date is not monday
    if (moment(date).format("d") !== "1") {
        return;
    }
    var fname = moment(date).format("YYYY%2F[W]WW") + ".md";
    var body = createWeekBody(moment(date));
    // create file
    fs.writeFileSync(fname, body);
});
