export function getDates(time_slice, data) {
  let parsed = [];

  for (var key in data[`Time Series (${time_slice})`]) {
    parsed.unshift(key);
  }
  return parsed;
}

//highest/lowest index
export function getVolumes(time_slice, data) {
  if (time_slice === "Daily") {
    return -1; //no volume returned in API
  } else {
    let parsed = [];
    //load/convert parsed values -> int array
    for (var key in data[`Time Series (${time_slice})`]) {
      parsed.unshift(data[`Time Series (${time_slice})`][key]["5. volume"]);
    }
    parsed = parsed.map(Number);

    return parsed;
  }
}
// 09:30:00 -> 16:00:00


export function performanceFunction(time_slice, data) {
  let parsed = [];
  for (var key in data[`Time Series (${time_slice})`]) {
    parsed.unshift(data[`Time Series (${time_slice})`][key]["4. close"]);
  }

  var maxPerformance = [];
  var minPerformance = [];
  maxPerformance[0] = -200;
  minPerformance[0] = 200;
  var performance = [];

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
  return performance;
}

export function hoursPerformance(time_slice, data) {
  let parsed = [];
  for (var key in data[`Time Series (${time_slice})`]) {
    parsed.unshift(data[`Time Series (${time_slice})`][key]["1. open"]);
  }

  var performance = [];

  for (let i = 0; i < parsed.length - 1; i++) {
    performance[i] = ((parsed[i + 2] - parsed[i]) * 100) / parsed[i];
  }
  return performance;
}
