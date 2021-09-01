
import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

const Infographic = (props) => {

    return (
        <Container>
            <SatelliteOne />
            <SatelliteTwo />
        </Container>
    )
}

export default withRouter(Infographic)