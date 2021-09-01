import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import stringConverter from '../helper/util'
import { Button, Container } from 'react-bootstrap';
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts'
import './satellite.css'

import * as d3 from 'd3'

//Global variables for the default graph
let startTime = new Date().valueOf();
let endTime = startTime + 60;
let date = new Date(Date.now()).toString()
let timeScale = 'minute'
let data = []
/*let data = [{ name: 1630344430 - 60, value: 20, id: 1 }, { name: 1630344430, value: 40, id: 1 }]*/
let value
let id
let min = -5
let max = 5
// slice value to display different time ranges default 60
let n = -60
//setting the domain of gra
let domain = d3.scaleTime().domain([startTime, endTime]);
let timeFormatter = (tick) => { return d3.timeFormat('%H:%M:%S')(new Date(tick * 1000)); };
let ticks = domain.ticks(d3.timeSecond.every(1));

const SatelliteTwo = (props) => {
    const socketUrl = `ws://localhost:443`

    // on click listener that retrieves past all-time data from get request
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
            n = 0
            console.log(1)
        }
    }

    // onclick listener to go to satellite two
    const gotoSatelliteOne = () => {
        props.history.push('/')
    }

    // on click listener that retrieves past minute data from get request
    const pastMinute = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite2/minute", {
            method: 'GET'
        })
        const status = await response.status
        console.log(response)
        console.log(status)
        if (status === 200) {
            const allTimeData = await response.json()
            data = allTimeData
            n = data.length * -1
            console.log(1)
            domain = d3.scaleTime().domain([data[0].UnixTimestamp, data[data.length - 1].UnixTimestamp]);
            timeFormatter = (tick) => { return d3.timeFormat('%H:%M:%S')(new Date(tick * 1000)); };
            ticks = domain.ticks(d3.timeSecond.every(1));
            min = -50
            max = 50
        }
    }

    // on click listener that retrieves past hour data from get request
    const pastHour = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite2/hour", {
            method: 'GET'
        })
        const status = await response.status
        console.log(response)
        console.log(status)
        if (status === 200) {
            const allTimeData = await response.json()
            data = allTimeData
            n = data.length * -1
            console.log(1)
            domain = d3.scaleTime().domain([data[0].UnixTimestamp, data[data.length - 1].UnixTimestamp]);
            timeFormatter = (tick) => { return d3.timeFormat('%H:%M')(new Date(tick * 1000)); };
            ticks = domain.ticks(d3.timeMinute.every(1));
        }
    }

    // on click listener that retrieves past minute data from get request
    const pastDay = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite2/day", {
            method: 'GET'
        })
        const status = await response.status
        console.log(response)
        console.log(status)
        if (status === 200) {
            const allTimeData = await response.json()
            data = allTimeData
            n = data.length * -1
            console.log(1)
            domain = d3.scaleTime().domain([data[0].UnixTimestamp, data[data.length - 1].UnixTimestamp]);
            timeFormatter = (tick) => { return d3.timeFormat('%H:%M')(new Date(tick * 1000)); };
            ticks = domain.ticks(d3.timeHour.every(1));
        }
    }


    //commented out due to bug
    /* const pastWeek = async () => {
        const response = await fetch("http://localhost:5000/api/v1/satellite1/week", {
            method: 'GET'
        })
        const status = await response.status
        console.log(response)
        console.log(status)
        if (status === 200) {
            const allTimeData = await response.json()
            data = allTimeData
            let now = new Date();
            n = data.length * -1
            console.log(1)
            domain = d3.scaleTime().domain([d3.timeWeek.floor(now), data[data.length - 1].UnixTimestamp]);
            timeFormatter = (tick) => { return d3.timeFormat('%D')(new Date(tick * 1000)); };
            ticks = domain.ticks(d3.timeDay.every(1));
        }
    } */


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
        console.log(date)

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

    return <Container className='mt-5'>
        <div className="mb-3">
            {' '}<Button variant="dark" className="btn-primary" onClick={pastMinute} size="sm" >s</Button>{' '}
            <Button variant="dark" onClick={pastHour} size="sm" >M</Button>{' '}
            <Button variant="dark" onClick={pastDay} size="sm" >H</Button>{' '}

        </div>
        {lastMessage !== null ? <LineChart width={1000} height={550} data={data}>
            <XAxis dataKey="UnixTimestamp" scale="time" type="number" domain={domain} tickFormatter={timeFormatter} ticks={ticks} angle={-90} textAnchor="end" height={70} padding={{ right: 20 }} />
            <YAxis domain={[min, max]} />
            <Legend verticalAlign="top" height={36} />
            <Line dataKey="Value" name={`Telemetry ID: ${id}`} isAnimationActive={false} dot={false} />
            <Tooltip content={<CustomTooltip />} />

        </LineChart>
            : <h1>Loading chart...</h1>}

        <Button variant="dark" className='mt-5' onClick={gotoSatelliteOne}>Satellite One</Button>
    </Container>
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