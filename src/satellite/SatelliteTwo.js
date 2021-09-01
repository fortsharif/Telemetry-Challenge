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
import * as d3 from 'd3'



let date = new Date(Date.now()).toString()
let oldDate
let data = []
/*let data = [{ name: 1630344430 - 60, value: 20, id: 1 }, { name: 1630344430, value: 40, id: 1 }]*/
let value
let id
let min = -5
let max = 5
// slice value to display different time ranges default 60
let n = -60


const SatelliteTwo = (props) => {
    const socketUrl = `ws://localhost:8082`

    const allTime = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite2", {
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

    const gotoSatelliteOne = () => {
        props.history.push('/')
    }

    const pastMinute = async () => {
        n = -20
        console.log("hit")
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
        data = data.slice(n)



        // updates domain of graph
        if (value > max) {
            max = Math.round(value)
            min = max * -1

        }
        if (value < min) {
            min = Math.round(value)
            max = min * -1
        }



    }

    return <div>
        <Button variant="dark" onClick={pastMinute} >1m</Button>
        <Button variant="dark">1H</Button>
        <Button variant="dark">1D</Button>
        <Button variant="dark">1W</Button>
        <Button variant="dark" onClick={allTime}>ALL TIME</Button>
        {lastMessage !== null ? <LineChart width={1000} height={550} data={data}>
            <XAxis dataKey="UnixTimestamp" scale="time" name="Time" type="number" domain={[data[0].UnixTimestamp, data[data.length - 1].UnixTimestamp]} tickFormatter={timeStr => moment(timeStr * 1000).format('HH:mm:ss')} angle={-90} textAnchor="end" height={70} padding={{ right: 20 }} />
            <YAxis domain={[min, max]} />
            <Legend verticalAlign="top" height={36} />
            <Line dataKey="Value" name={`Telemetry ID: ${id}`} isAnimationActive={false} dot={false} />
            <Tooltip content={<CustomTooltip />} />

        </LineChart>
            : <h1>hi</h1>}

        <Button variant="dark" onClick={gotoSatelliteOne}>Satellite One</Button>
    </div>
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return <div>
            <h4>
                {new Date(label * 1000).toString()}
            </h4>
            <p>
                Value :{payload[0].payload.Value}
            </p>
            <p>
                Telemetry ID: {payload[0].payload.TelemetryId}
            </p>
        </div>
    }
    return null
}


export default withRouter(SatelliteTwo)