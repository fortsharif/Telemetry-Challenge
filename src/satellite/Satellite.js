import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import stringConverter from '../helper/util'

let date = new Date(Date.now()).toString()

const Satellite = (props) => {
    const [socketUrl, setSocketUrl] = useState("ws://localhost:8080")
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
    }

    return <>
        {loading ? <h1>hi</h1> : date}
    </>
}

export default withRouter(Satellite)