import * as fs from "fs";
import * as moment from "moment";

const argv = process.argv;

const usage = "Usage: node weekly-generator.ts <start-date> <end-date>";

if (argv.length !== 4) {
  console.log(usage);
  process.exit(1);
}

const date_to_props = (date: moment.Moment) => {
  const name_of_day = [
    "",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일",
  ] 
  const day_of_week_mod = (parseInt(date.format("d"))) === 0 ? 7 : parseInt(date.format("d"));
  const year = date.format("YYYY");
  const month = date.format("YYYY/MM");
  const week_number = date.format("WW");
  const date_of_day_by_week = date.format("YYYY/[W]WW-"+day_of_week_mod.toString());
  const day_of_week = name_of_day[day_of_week_mod];
  return { year, month, week_number, date_of_day_by_week, day_of_week };
}

const createWeekBody = (date: moment.Moment) => {
  // if day is not monday, return empty string
  if (date.format("d") !== "1") {
    return "";
  }
  const props = date_to_props(date);
  const properties = `\
start-at:: [[${date.format("YYYY/MM/DD")}]]
end-at:: [[${moment(date).add(6,"days").format("YYYY/MM/DD")}]]
month:: [[${moment(date).add(3,"days").format("YYYY/MM")}]]
`
  const date_by_weeks = [];
  // end of week
  const end_of_week = moment(date).add(7, "days");
  while(date.isBefore(end_of_week)) {
    date_by_weeks.push(date_to_props(date).date_of_day_by_week);
    date.add(1, "days");
  }
  console.log(date_by_weeks);
  const body = `\
${properties}
- ### 한 주 계획
- ### 일별 요약
${
  date_by_weeks.map((date_of_day_by_week)=>{
    return `- [[${date_of_day_by_week}]]`
  }).join("\n")
}
- ### 한 주 회고
  `
  return body;
}


// from start date to end date
const start = moment(argv[2]);
const end = moment(argv[3]);

const dates = [];
while (start.isBefore(end)) {
  dates.push(start.format("YYYY-MM-DD"));
  start.add(1, "days");
}

dates.forEach((date)=>{
  // continue if date is not monday
  if (moment(date).format("d") !== "1") {
    return;
  }
  const fname = moment(date).format("YYYY%2F[W]WW")+".md";
  const body = createWeekBody(moment(date));
  // create file
  fs.writeFileSync(fname, body);
})