export function getDates(time_slice, data) {
  let parsed = [];
  if (time_slice == "Weekly") {
    for (var key in data["Weekly Adjusted Time Series"]) {
      parsed.unshift(key);
    }
  }
  for (var key in data[`Time Series (${time_slice})`]) {
    parsed.unshift(key);
  }
  return parsed;
}

//highest/lowest index
export function Volume(time_slice, data) {
  if (time_slice == "Daily" || time_slice == "Weekly") {
    return; //no volume returned in API
  } else {
    var parsed = [];
    //load/convert parsed values -> int array
    for (var key in data[`Time Series (${time_slice})`]) {
      parsed.unshift(data[`Time Series (${time_slice})`][key]["5. volume"]);
    }
    parsed = parsed.map(Number);

    //find highest volume
    let highestVol = Math.max(...parsed);
    let lowestVol = Math.min(...parsed);

    //find lowest volume
    var highIndex = parsed.indexOf(Math.max(...parsed));
    var lowIndex = parsed.indexOf(Math.min(...parsed));

    //find dates of high/low volume
    let dates = getDates(time_slice, data);
    let highDate = dates[highIndex];
    let lowDate = dates[lowIndex];

    let highReturnKey = new Map();
    highReturnKey.set("date", highDate);
    highReturnKey.set("volume", highestVol);

    let lowReturnKey = new Map();
    lowReturnKey.set("date", lowDate);
    lowReturnKey.set("volume", lowestVol);

    return [highReturnKey, lowReturnKey, parsed];
  }
}

// export function performance(time_slice, data) {
//   let parsed = [];
//   let performances = [];
//   var bestPerformace = 0;
//   var worstPerformance = 0;

//   for (var key in data[`Time Series (${time_slice})`]) {
//     parsed.unshift(data[`Time Series (${time_slice})`][key]["4. close"]);
//   }
//   parsed = parsed.map(Number);

//   for (var i = 0; i < parsed.length(); i++) {
//     parsed[i] = 0;
//   }
//   console.log(parsed);
// }
