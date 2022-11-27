import React from "react";


function Row(props)
{
    return (
        <tr>
            <td>{props.date}</td>
            <td>{props.perf}</td>
            <td>{props.vol}</td>
        </tr>
    )
}

export function DataTable(props)
{
    let arr = props.data

    const get_data = data => {
        let final_data = []
        let total_rows = data[0].length
        if (total_rows >= 100)
            total_rows = 100

        for (let i = 0; i < total_rows; i++)
            final_data.push(<Row key={i} date={data[0][i]} perf={data[1][i].toPrecision(3)} vol={data[2][i]} />)

        return final_data; 
    }

    return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Time Frame</th>
                        <th>Performance</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        get_data(arr)
                    }
                </tbody>
            </table>
    )
}

