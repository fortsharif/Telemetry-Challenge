import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import stringConverter from '../helper/util'
import { timeFormat } from 'd3-time-format'
import Button from 'react-bootstrap/Button';
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from 'recharts'
import moment from 'moment'



let date = new Date(Date.now()).toString()
let oldDate
let data = []
/*let data = [{ name: 1630344430 - 60, value: 20, id: 1 }, { name: 1630344430, value: 40, id: 1 }]*/
let value
let id
let min = -5
let max = 5


const Satellite = ({ match }) => {
    const socketUrl = `ws://localhost:${match.params.port}`

    const allTime = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite1", {
            method: 'GET'
        })
        const status = await response.status
        console.log(response)
        console.log(status)
        if (status === 200) {
            const allTimeData = await response.json()
            data = allTimeData
            console.log(1)
        }
    }


    const {
        lastMessage
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log('socket open'),
        shouldReconnect: (closeEvent) => true,
    })


    // add on click

    //add option for scale log, linear etc

    if (lastMessage !== null) {
        let stringToArray = stringConverter(lastMessage.data)
        date = parseInt(stringToArray[0])
        //date = new Date(parseInt(stringToArray[0]) * 1000)


        value = parseFloat(stringToArray[2]).toFixed(2)
        id = parseInt(stringToArray[1])
        let dataObject = { UnixTimestamp: date, Value: value, TelemetryId: id }
        data = [...data, dataObject]
        //data = data.slice(-60)



        // updates domain of graph
        if (value > max) {
            max = Math.round(value)

        }
        if (value < min) {
            min = Math.round(value)
        }



    }

    return <div>
        <Button variant="dark" >1m</Button>
        <Button variant="dark">1H</Button>
        <Button variant="dark">1D</Button>
        <Button variant="dark">1W</Button>
        <Button variant="dark" onClick={allTime}>ALL TIME</Button>
        {lastMessage !== null ? <LineChart width={2000} height={500} data={data}>
            <XAxis dataKey="UnixTimestamp" scale="time" name="Time" type="number" domain={[data[0].UnixTimestamp, data[data.length - 1].UnixTimestamp]} />
            <YAxis domain={[-50, 50]} />
            <Legend verticalAlign="top" height={36} />
            <Line dataKey="Value" name={`Telemetry ID: ${id}`} isAnimationActive={false} dot={false} />


        </LineChart>
            : <h1>hi</h1>}


    </div>
}



export default withRouter(Satellite)