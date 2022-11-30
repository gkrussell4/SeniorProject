import { useState, useEffect } from "react";
import React from "react";
import { getDates, getVolumes, hoursPerformance, performanceFunction } from "./algorithms.js";
import { Welcome } from "./components/defaultWelcome.js";
import { DailyTable } from "./components/dailyTable.js";
import "./App.css";
import Select from "react-select";


import { SummaryInfo } from "./components/summaryInfo.js";
import { DataTable } from "./components/dataTable.js";

const API_KEY = "0X7FGLTBB3E4SVWG";
const API_REQUEST_BASE = "https://www.alphavantage.co/query?function="; //base of the API URL
let url = ``;
let time_slice = "";

const time_frame = ["5 Minute", "15 Minute", "30 Minute", "60 Minute", "Daily"];



function App() {
  //add more to ticker list later
  const ticker_list = ["AAPL", "NVDA", "IBM", "UNH"];

  //formatting output for list
  const ticker_list_display = [];
  ticker_list.forEach(function (element) {
    ticker_list_display.push({ label: element, value: element });
  });

  const [ticker_select, setTicker] = useState(ticker_list[0]);
  const [time_frame_select, setTimeFrame] = useState(time_frame[0]);
  const [date_slices, setDateSlices] = useState(null);
  const [performance_slices, setPerformanceSlices] = useState(null);
  const [volume_slices, setVolumeSlices] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [displaySummary, setSummaryDisplay] = useState(false);
  const [is_daily, setDaily] = useState(false);
  const [show_welcome, setWelcome] = useState(true); 
  const [show_table, setTable] = useState(false); 

  const getDateSlice = async () => {
    //fetching data
    const response = await fetch(url);
    const data = await response.json();
    return getDates(time_slice, data);
  };

  const getPerformanceSlice = async () => {
    const response = await fetch(url);
    const data = await response.json();
    return performanceFunction(time_slice, data);
  };

  const getVolumeSlice = async () => {
    const response = await fetch(url);
    const data = await response.json();
    return getVolumes(time_slice, data);
  };

  const test = async () => {
    const r = await fetch(`${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=30min&outputsize=full&apikey=0X7FGLTBB3E4SVWG`);
    const d = await r.json();
    return d;
  }

  const submit = async () => {
    setWelcome(false); 
    setDaily(false);
    setSummaryDisplay(false); 
    setTable(false); 
    if (time_frame_select === "5 Minute") {
      time_slice = "5min";
    } else if (time_frame_select === "15 Minute") {
      time_slice = "15min";
    } else if (time_frame_select === "30 Minute") {
      time_slice = "30min";
    } else if (time_frame_select === "60 Minute") {
      time_slice = "60min";
    } else {
      time_slice = "Daily";
      setDaily(true); 
    }
    console.log(time_slice); 
    if (time_slice === "Daily") {
      url = `${API_REQUEST_BASE}TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else {
      url = `${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=${time_slice}&outputsize=full&apikey=0X7FGLTBB3E4SVWG`;
    }

    //get/set date slices
    const display_date_slice = await getDateSlice();
    console.log(display_date_slice); 
    setDateSlices(display_date_slice);

    //get/set performance array
    const get_performance_slice = await getPerformanceSlice();
    setPerformanceSlices(get_performance_slice);

    //get/set best performance
    const bestPerf = Math.max(...get_performance_slice);
    var bestPerfAppended = bestPerf.toPrecision(3);

    //get/set worst performance
    var worstPerf = Math.min(...get_performance_slice);
    var worstPerfAppended = worstPerf.toPrecision(3);

    //get/set best time_slice
    const BestPindex = get_performance_slice.findIndex((object) => {
      return object === bestPerf;
    });

    const bestPDate = display_date_slice[BestPindex];

    //get/set worst time_slice
    const WorstPIndex = get_performance_slice.findIndex((object) => {
      return object === worstPerf;
    });

    const worstPDate = display_date_slice[WorstPIndex];



    //Retrieving 30min time slices for First & Last HourAvgs Function
    const hourAvgs = await test();
    console.log(hourAvgs);
    let T = getDates("30min", hourAvgs); //array with dates n hours of 30min
    let PerfThirty = hoursPerformance("30min", hourAvgs);
    console.log(PerfThirty);
    let timeHours = [];
    let openPerfHour = [];
    let closePerfHour = [];
    let j = 0;
    let k = 0;
    for (var i = 0; i < T.length; i++) {
      timeHours.push(T[i].substring(11, 19));
    }
    for (var i = 0; i < timeHours.length; i++) {
      if (timeHours[i] === "09:30:00") {
        openPerfHour[j] = PerfThirty[i];
        j++;
      } else if (timeHours[i] === "15:00:00") {
        closePerfHour[k] = PerfThirty[i];
        k++;
      }
    }
    var sum = 0;
    for (var n of openPerfHour) {
      sum += n;
    }
    var firstHourAvg = (sum / openPerfHour.length).toPrecision(3);
    console.log(firstHourAvg);

    var sum0 = 0;
    for (var n of closePerfHour) {
      sum0 += n;
    }
    var closeHourAvg = (sum0 / closePerfHour.length).toPrecision(3);
    console.log(closeHourAvg);



    if (time_slice !== "Daily") {
      //get/set highest volume
      const volumesList = await getVolumeSlice();
      setVolumeSlices(volumesList)
      const maxVol = Math.max(...volumesList);

      const maxVIndex = volumesList.findIndex((object) => {
        return object === maxVol;
      });

      const maxVDate = display_date_slice[maxVIndex];

      //get/set lowest volume
      const minVol = Math.min(...volumesList);
      const minVIndex = volumesList.findIndex((object) => {
        return object === minVol;
      });

      const minVDate = display_date_slice[minVIndex];
      setSummaryData({ bpt: bestPDate, bp: bestPerfAppended, wpt: worstPDate, wp: worstPerfAppended, hvt: maxVDate, hv: maxVol, mvt: minVDate, mv: minVol, fha: firstHourAvg, cha: closeHourAvg })
      setSummaryDisplay(true)
    }
    setTable(true); 
  };

  return (
    <div className="TopLayer">
      <div className="Header">
        <h1>DIY Stock Market Analysis</h1>
      </div>
      <div className="App">
        <Select options={ticker_list_display}
          onChange={(opt) => setTicker(opt.value)}
        ></Select>
      </div>
      <div className="buttonLayer">
        <select className="selButton" value={time_frame_select}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          {time_frame.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
        <button className="submitButton" onClick={submit}>
          Submit
        </button>
      </div>
      <div className="tableMove">
        {displaySummary && <SummaryInfo ticker={ticker_select} time_select={time_frame_select} data={summaryData} />}
        {show_table && !is_daily && <DataTable daily={is_daily} data={Array(date_slices, performance_slices, volume_slices)} />}
        {show_table && is_daily && <DailyTable data={Array(date_slices, performance_slices)}/>}
      </div>
      {show_welcome && <div className="welcome-container">
                              <Welcome className="welcome"/>
                          </div>}
    </div>
    
  );
}
export default App;

/*

object 1:
table
time_slice      performance (of time slice)      volume 

object 2:
chart of object 1

object 3:
box
highest volume
lowest volume
best performing time slice
worst performing time slice

*/
