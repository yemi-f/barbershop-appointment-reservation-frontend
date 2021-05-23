import React, { useState } from 'react';
import { Form, Container, Button, Col, Toast } from "react-bootstrap";
import axios from 'axios';
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const LoginForm = ({ updateLoggedIn }) => {
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = e => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value
        });

        e.preventDefault();
    }

    const handleSubmit = (e) => {
        axios.post("/users/login", data)
            .then(res => { Cookies.set("token", res.data); updateLoggedIn(true) })
            .catch(err => {
                setIsError(true);
                console.log(err)
            });

        e.preventDefault();
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Row>
                    <Form.Group as={Col} md="6" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter email address"
                            required
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            placeholder="Enter your password"
                            name="password"
                            value={data.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit" >
                    View Reservations
                </Button>
            </Form>
            {isError && <ErrorToast />}

        </Container>
    )
}


const ErrorToast = () => {
    return (
        <Toast show={true} className="bg-white" style={{
            position: 'absolute',
            top: 8,
            right: 8,
        }}>
            <Toast.Body>
                <FontAwesomeIcon icon="exclamation-triangle" size="1x" color="#F2003C" className="mr-2" />Incorrect email or password
            </Toast.Body>
        </Toast>
    )
}



export default LoginForm;