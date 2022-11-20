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
    let minVol = Math.min(...parsed);

    //find lowest volume
    var highIndex = parsed.indexOf(Math.max(...parsed));
    var minIndex = parsed.indexOf(Math.min(...parsed));

    //find dates of high/low volume
    let dates = getDates(time_slice, data);
    let highDate = dates[highIndex];
    let minDate = dates[minIndex];

    let highReturnKey = new Map();
    highReturnKey.set("date", highDate);
    highReturnKey.set("volume", highestVol);

    let minReturnKey = new Map();
    minReturnKey.set("date", minDate);
    minReturnKey.set("volume", minVol);

    return [highReturnKey, minReturnKey, parsed];
  }
}

export function performanceFunction(time_slice, data) {
  let parsed = [];
  console.log("algo time_slice is: " + time_slice);
  for (var key in data[`Time Series (${time_slice})`]) {
    parsed.unshift(data[`Time Series (${time_slice})`][key]["4. close"]);
  }

  let maxPerformance = [];
  let minPerformance = [];
  maxPerformance[0] = -200;
  minPerformance[0] = 200;
  let performance = [];

  for (let i = 0; i < parsed.length - 1; i++) {
    performance[i] = ((parsed[i + 1] - parsed[i]) * 100) / parsed[i];
    maxPerformance[0] = Math.max(maxPerformance[0], performance[i]);
    minPerformance[0] = Math.min(maxPerformance[0], performance[i]);
    if (maxPerformance[0] === performance[i]) {
      maxPerformance[1] = i;
    }

    if (minPerformance[0] === performance[i]) {
      minPerformance[1] = i;
    }
  }
  console.log(Number(maxPerformance[0]).toPrecision(3));
  console.log(maxPerformance[1]);
  console.log(Number(minPerformance[0].toPrecision(3)));
  console.log(minPerformance[1]);

  let dates = getDates(time_slice, data);
  let highDate = dates[maxPerformance[1]];
  let minDate = dates[minPerformance[1]];

  let highPerformance = maxPerformance[0].toPrecision(3);
  let lowPerformance = minPerformance[0].toPrecision(3);

  let highReturnKey = new Map();
  highReturnKey.set("date", highDate);
  highReturnKey.set("percent", highPerformance);

  let minReturnKey = new Map();
  minReturnKey.set("date", minDate);
  minReturnKey.set("percent", lowPerformance);

  return [highReturnKey, minReturnKey, performance];
}
