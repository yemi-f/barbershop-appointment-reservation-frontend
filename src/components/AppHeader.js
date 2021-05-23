import React from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const AppHeader = ({ loggedIn, updateLoggedIn }) => {
    const logout = () => {
        axios.get("/users/logout")
            .then(() => {
                updateLoggedIn(false);
                Cookies.remove("token");
            })
            .catch(err => console.log(err))
    }
    return (
        <Navbar bg="light" expand="sm" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">The Barbershop</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        {loggedIn && <Nav.Link onClick={() => logout()} as={Link} to="/dashboard">Logout</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppHeader;