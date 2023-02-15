"use strict";
exports.__esModule = true;
var fs = require("fs");
var moment = require("moment");
var argv = process.argv;
var usage = "Usage: node daily-generator.ts <start-date> <end-date>";
if (argv.length !== 4) {
    console.log(usage);
    process.exit(1);
}
var defaultForm = function (month, week_number, alias, day_of_week) { return "alias:: [[".concat(alias, "]]\nday-of-week:: ").concat(day_of_week, "\n"); };
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
    var wd = (parseInt(date.format("d"))) === 0 ? 7 : parseInt(date.format("d"));
    var month = date.format("YYYY/MM");
    var week_number = date.format("WW");
    var alias = date.format("YYYY/[W]WW-" + wd.toString());
    var day_of_week = name_of_day[wd];
    return { month: month, week_number: week_number, alias: alias, day_of_week: day_of_week };
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
    var _a = date_to_props(moment(date)), month = _a.month, week_number = _a.week_number, alias = _a.alias, day_of_week = _a.day_of_week;
    var body = defaultForm(month, week_number, alias, day_of_week);
    var fname = date.replace(/-/g, "_") + ".md";
    // create file
    fs.writeFileSync("./".concat(fname), body);
});
