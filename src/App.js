import { useState, useEffect } from "react";
import React from "react";
import Intraday from "./algorithms.js";

function App() {
  const ticker_list = ["AAPL", "NVDA", "IBM"]; //testing placeholders
  const time_frame = [
    "1 Minute",
    "5 Minute",
    "15 Minute",
    "30 Minute",
    "60 Minute",
  ]; //testing placeholders
  const API_KEY = "0X7FGLTBB3E4SVWG";
  const API_REQUEST_BASE = "https://www.alphavantage.co/query?function="; //base of the API URL

  const [ticker_select, setTicker] = useState(ticker_list[0]);
  const [time_frame_select, setTimeFrame] = useState(time_frame[0]);
  const [data, setData] = useState({});
  const [trigger, setTrigger] = useState(false);
  let parsed = [];

  // const logChange = useEffect(() => {
  //   console.log('new value of ans ', ans);
  // }, [ans]);

  const logChange = useEffect(() => {
    let url = `${API_REQUEST_BASE}TIME_SERIES_INTRADAY&symbol=${ticker_select}&interval=1min&outputsize=full&apikey=0X7FGLTBB3E4SVWG`;
    const data = fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, [trigger]); // pass `value` as a dependency

  const submit = (e) => {
    e.preventDefault();
    setTrigger(!trigger); //fetch data from API

    /*TO DO 
    Conditional logic for which algorithm function to call based on time_frame_select
    */

    parsed = Intraday(time_frame_select, data);
  };

  return (
    <form>
      <select value={ticker_select} onChange={(e) => setTicker(e.target.value)}>
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
  );
}

export default App;

//this is an example of how to access 1 min intraday open values "Time Series (1min)"][key]["1. open"])
//DONT RUN IT, ITS CASE SENSITIVE BOYS

//Data return example: 1. open 2. high 3. low 4. close 5. volume

/*- TODO 
  - 15min+ and daily, 
  -display as tabs
  -code splitting for readability.
  -misc. data (best/worst performing increment of time), maybe average performer over weekdays etc etc
*/

// KNOWN BUGS: useEffect triggers twice upon first render
