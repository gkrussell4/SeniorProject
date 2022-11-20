import { useState, useEffect } from "react";
import React from "react";
import { getDates, Volume } from "./algorithms.js";

function App() {
  const ticker_list = [
    "AAPL",
    "IBM",
    "AMZN",
    "GOOG",
    "TSLA",
    "PEP",
    "COST",
    "META",
    "AVGO",
    "CSCO",
    "NFLX",
    "INTC",
    "PYPL",
    "NVDA",
    "UNH",
  ];
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
  let dates = [];
  let url = ``;
  let time_slice = "";

  const submit = async (e) => {
    e.preventDefault();

    if (time_frame_select == "5 Minute") {
      time_slice = "5min";
    } else if (time_frame_select == "15 Minute") {
      time_slice = "15min";
    } else if (time_frame_select == "30 Minute") {
      time_slice = "30min";
    } else if (time_frame_select == "60 Minute") {
      time_slice = "60min";
    } else if (time_frame_select == "Daily") {
      time_slice = "Daily";
    } else {
      time_slice = "Weekly";
    }

    if (time_slice == "Daily") {
      url = `${API_REQUEST_BASE}TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else if (time_slice == "Weekly") {
      url = `${API_REQUEST_BASE}TIME_SERIES_WEEKLY_ADJUSTED&symbol=${ticker_select}&apikey=0X7FGLTBB3E4SVWG`;
    } else {
      url = `${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=${time_slice}&outputsize=full&apikey=0X7FGLTBB3E4SVWG`;
    }

    //fetching data
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (time_slice == "Daily" || time_slice == "Weekly") {
      dates = getDates(time_slice, data);
    } else {
      dates = getDates(time_slice, data);
      console.log(dates);
      //performance(time_slice, data);
    }

    let volume = Volume(time_slice, data);
    console.log(volume[0].get("date"), volume[0].get("volume"));
    console.log(volume[1].get("date"), volume[1].get("volume"));
    console.log(volume[2]);
  };

  return (
    <div>
      <form>
        <select
          value={ticker_select}
          onChange={(e) => setTicker(e.target.value)}
        >
          {ticker_list.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
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
      </form>
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
