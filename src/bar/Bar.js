import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap'

const Bar = (props) => {


    useEffect(() => {

    }, [])

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand >Telemetry Challenge</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">


                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default withRouter(Bar)