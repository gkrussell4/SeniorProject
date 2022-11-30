import React from "react";

function Row(props) {
    return (
        <tr>
            <td>{props.date}</td>
            <td>{colorPerf(props)}</td>
        </tr>
    )
}


function colorPerf(props) {
    if (props.perf > 0) {
        return <td1>{'+' + props.perf + '%'}</td1>
    } else if (props.perf < 0) {
        return <td2>{props.perf + '%'}</td2>
    } else {
        return <td3>{'+' + props.perf+ '%'}</td3>
    }
}

export function DailyTable(props) {

    let arr=props.data;

    const get_data = data => {
        let final_data = []
        let total_rows = data[0].length
        if (total_rows >= 100)
            total_rows = 250

        for (let i = 0; i < total_rows; i++)
            if (props.daily != true) {
                if (data[0][i] !== undefined && data[1][i] !== undefined)
                    final_data.push(<Row key={i} daily={props.daily} date={data[0][i]} perf={data[1][i].toPrecision(3)} />)
        
        }
        return final_data;
    }

    return (
        <table className="table">
            <thead>
                <tr>
                <th>Time Frame</th>
                <th>Performance</th>
                </tr>
            </thead>
            {
                get_data(arr) 
            }
        </table>

    )
}