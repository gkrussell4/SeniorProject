import React from "react";


export function SummaryInfo(props) {

    return (
      <table>
          <thead>
            <tr>
              <th>
                {props.ticker} Summary for {props.time_select}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"Best Date: " + props.data.bpt + "\t | Best: " + props.data.bp + "%"}</td>
            </tr>
            <tr>
              <td>{"Worst Date: " + props.data.wpt + "\t | Worst: " + props.data.wp + "%"}</td>
            </tr>
            <tr>
              <td>{"Highest Volume Date: " + props.data.hvt + "\t | Highest Volume: " + props.data.hv}</td>
            </tr>
            <tr>
              <td>{"Lowest Volume Date: " + props.data.mvt + "\t | Lowest Volume: " + props.data.mv}</td>
            </tr>
          </tbody>
        </table>
    )
  }