export default function Intraday(time_frame_select, data) {
  let parsed = [];
  console.log("timeframe_select: " + time_frame_select);
  console.log(data);
  console.log("debugging probe");
  if (time_frame_select == "1 Minute") {
    console.log("did enter");
    for (var key in data["Time Series (1min)"]) {
      parsed.push(data["Time Series (1min)"][key]["1. open"]);
    }
  }
  console.log(parsed);
  return parsed;
}

//this["Time Series (1min)"]["2022-10-31 04:01:00"]
//CASE SENSITIVE BOYS
