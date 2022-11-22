import { useState, useEffect } from "react";
import React from "react";
import { getDates, Volume, performanceFunction } from "./algorithms.js";

import "./App.css";

import Select from "react-select";

function App() {
  //add more to ticker list later
  const ticker_list = ["AAPL", "NVDA", "IBM", "UNH"];

  //formatting output for list
  const ticker_list_display = [];
  ticker_list.forEach(function (element) {
    ticker_list_display.push({ label: element, value: element });
  });

  const time_frame = [
    "5 Minute",
    "15 Minute",
    "30 Minute",
    "60 Minute",
    "Daily",
    "Weekly",
  ];
  const API_KEY = "0X7FGLTBB3E4SVWG";
  const API_REQUEST_BASE = "https://www.alphavantage.co/query?function="; //base of the API URL

  const [ticker_select, setTicker] = useState(ticker_list[0]);
  const [time_frame_select, setTimeFrame] = useState(time_frame[0]);
  const [volume, setVolume] = useState(null);
  const [submitted, setSubmit] = useState(false);
  let dates = [];
  let url = ``;
  let time_slice = "";

  const submit = async (e) => {
    e.preventDefault();

    if (time_frame_select === "5 Minute") {
      time_slice = "5min";
    } else if (time_frame_select === "15 Minute") {
      time_slice = "15min";
    } else if (time_frame_select === "30 Minute") {
      time_slice = "30min";
    } else if (time_frame_select === "60 Minute") {
      time_slice = "60min";
    } else if (time_frame_select === "Daily") {
      time_slice = "Daily";
    } else {
      time_slice = "Weekly";
    }

    if (time_slice === "Daily") {
      url = `${API_REQUEST_BASE}TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else if (time_slice === "Weekly") {
      url = `${API_REQUEST_BASE}TIME_SERIES_WEEKLY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else {
      url = `${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=${time_slice}&outputsize=full&apikey=0X7FGLTBB3E4SVWG`;
    }

    //fetching data
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);


    //  testing algos for functionality
    // let volume = Volume(time_slice, data);
    // let performance = performanceFunction(time_slice, data);
    // console.log(performance[0].get("date"), performance[0].get("percent"));
    // console.log(performance[1].get("date"), performance[1].get("percent"));
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
      <p>{ticker_select}</p>
      <p>{time_frame_select}</p>

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
