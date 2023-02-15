import * as fs from "fs";
import * as moment from "moment";

const argv = process.argv;

const usage = "Usage: node daily-generator.ts <start-date> <end-date>";

if (argv.length !== 4) {
  console.log(usage);
  process.exit(1);
}

const defaultForm = (month : string, week_number : string, alias: string, day_of_week: string) => `\
alias:: [[${alias}]]
day-of-week:: ${day_of_week}
`

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
  const wd = (parseInt(date.format("d"))) === 0 ? 7 : parseInt(date.format("d"));
  const month = date.format("YYYY/MM");
  const week_number = date.format("WW");
  const alias = date.format("YYYY/[W]WW-"+wd.toString());
  const day_of_week = name_of_day[wd];
  return { month, week_number, alias, day_of_week };
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
  const { month, week_number, alias, day_of_week } = date_to_props(moment(date));
  const body = defaultForm(month, week_number, alias, day_of_week);
  const fname = date.replace(/-/g, "_")+".md";
  // create file
  fs.writeFileSync(`./${fname}`, body);
})