import { useState, useEffect } from "react";
import React from "react";
import { getDates, getVolumes, performanceFunction } from "./algorithms.js";
import "./App.css";
import Select from "react-select";
import { render } from "@testing-library/react";

const API_KEY = "0X7FGLTBB3E4SVWG";
const API_REQUEST_BASE = "https://www.alphavantage.co/query?function="; //base of the API URL
let dates = [];
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
  const [bestPerfTime, setBestPerfTime] = useState(null);
  const [bestPerformance, setBestPerformance] = useState(null);
  const [worstPerfTime, setWorstPerfTime] = useState(null);
  const [worstPerformance, setWorstPerformance] = useState(null);
  const [volume_slices, setVolumeSlices] = useState(null);
  const [HighVolTime, setHighVolTime] = useState(null);
  const [MinVolTime, setMinVolTime] = useState(null);
  const [maxVolume, setMaxVolume] = useState(null);
  const [minVolume, setMinVolume] = useState(null);

  const getDateSlice = async () => {
    //fetching data
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
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

  const submit = async () => {
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
    }

    if (time_slice === "Daily") {
      url = `${API_REQUEST_BASE}TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else {
      url = `${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=${time_slice}&outputsize=full&apikey=0X7FGLTBB3E4SVWG`;
    }

    //get/set date slices
    const display_date_slice = await getDateSlice();
    setDateSlices(display_date_slice);

    //get/set performance array
    const get_performance_slice = await getPerformanceSlice();
    setPerformanceSlices(get_performance_slice);

    //get/set best performance
    const bestPerf = Math.max(...get_performance_slice);
    setBestPerformance(bestPerf);

    //get/set worst performance
    var worstPerf = Math.min(...get_performance_slice);
    setWorstPerformance(worstPerf);

    //get/set best time_slice
    const BestPindex = get_performance_slice.findIndex((object) => {
      return object === bestPerf;
    });

    const bestPDate = display_date_slice[BestPindex];
    setBestPerfTime(bestPDate);

    //get/set worst time_slice
    const WorstPIndex = get_performance_slice.findIndex((object) => {
      return object === worstPerf;
    });
    const worstPDate = display_date_slice[WorstPIndex];
    setWorstPerfTime(worstPDate);

    if (time_slice !== "Daily") {
      //get/set highest volume
      const volumesList = await getVolumeSlice();
      setVolumeSlices(volumesList);
      const maxVol = Math.max(...volumesList);
      setMaxVolume(maxVol);
      const maxVIndex = volumesList.findIndex((object) => {
        return object === maxVol;
      });
      const maxVDate = display_date_slice[maxVIndex];
      setHighVolTime(maxVDate);

      //get/set lowest volume
      const minVol = Math.min(...volumesList);
      setMinVolume(minVol);
      const minVIndex = volumesList.findIndex((object) => {
        return object === minVol;
      });
      const minVDate = display_date_slice[minVIndex];
      setMinVolTime(minVDate);
    } else {
      //reset volume to null
      const temp = null;
      setHighVolTime(temp);
      setMaxVolume(temp);
      setHighVolTime(temp);
      setMinVolume(temp);
    }
  };

  return (
    <div className="App">
      <Select
        options={ticker_list_display}
        onChange={(opt) => setTicker(opt.value)}
      ></Select>
      <select
        value={time_frame_select}
        onChange={(e) => setTimeFrame(e.target.value)}
      >
        {time_frame.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
      <button type="button" onClick={submit}>
        Submit
      </button>
      <p>{"best date: " + bestPerfTime}</p>
      <p>{"best: " + bestPerformance}</p>
      <p>{"worst date: " + worstPerfTime}</p>
      <p>{"worst: " + worstPerformance}</p>
      <p>{"highest vol date: " + HighVolTime}</p>
      <p>{"highest volume: " + maxVolume}</p>
      <p>{"lowest vol date: " + MinVolTime}</p>
      <p>{"lowest volume: " + minVolume}</p>
      <p></p>
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
