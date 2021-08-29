import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import stringConverter from '../helper/util'
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts'

let date = new Date(Date.now()).toString()
let data = []
let voltage

const Satellite = ({ match }) => {
    const [socketUrl, setSocketUrl] = useState(`ws://localhost:${match.params.port}`)
    const [loading, setLoading] = useState(true)

    const {
        lastMessage
    } = useWebSocket(socketUrl)


    if (lastMessage !== null && loading === true) {
        setLoading(false)
    }

    if (loading === false && lastMessage !== null) {
        let stringToArray = stringConverter(lastMessage.data)
        date = new Date(parseInt(stringToArray[0]) * 1000).toString()
        voltage = parseFloat(stringToArray[2])

        let dataObject = { name: date, value: voltage }
        data = [...data, dataObject].slice(-20)
        console.log(data)


    }

    return <div>{!loading ? <LineChart width={2000} height={500} data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[-50, 50]} />
        <Line dataKey="value" />
    </LineChart>
        : <h1>hi</h1>}

    </div>
}

export default withRouter(Satellite)