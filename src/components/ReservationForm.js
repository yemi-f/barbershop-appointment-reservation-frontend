import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Col } from "react-bootstrap";
import { getNextBusinessDay } from "../utils/getNextBusinessDay"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import axios from 'axios';
import { useHistory, useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

export const ReservationForm = () => {
    const history = useHistory();
    const minDate = getNextBusinessDay;
    const [times, setTimes] = useState([]);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        date: minDate,
        startTime: "Loading...",
    })


    useEffect(() => {
        axios.get(`/reservations/availability?date=${data.date}`)
            .then(res => {
                setTimes(res.data.available);
                setData(d => ({
                    ...d,
                    startTime: res.data.available[0]
                }));
            })
            .catch(err => console.log(err))
    }, [data.date])


    const handleInputChange = e => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value
        });

        e.preventDefault();
    }

    const handleDateChange = d => {
        setData({
            ...data,
            date: dayjs(d).format("YYYY-MM-DD")
        });
    }

    const handleSubmit = (e) => {
        const tempData = Object.assign({}, data);
        delete tempData.date;

        axios.post("/reservations", tempData)
            .then(() => {
                history.push({
                    pathname: "/success",
                    state: { success: true }
                });
            })
            .catch(err => {
                history.push({
                    pathname: "/error",
                    state: { success: false }
                });
            });

        e.preventDefault();
    };

    return (
        <Container className="mb-4">
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} md="6" controlId="formFirstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            required
                            name="firstName"
                            value={data.firstName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="formLastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter last name"
                            name="lastName"
                            value={data.lastName}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} md="4" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            required
                            value={data.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Flatpickr
                            value={data.date}
                            options={{
                                altInput: true,
                                altInputClass: "form-control bg-white",
                                minDate: minDate,
                                disable: [function (date) {
                                    return (date.getDay() === 0 || date.getDay() === 6);
                                }]
                            }}
                            onChange={handleDateChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="formTime">
                        <Form.Label>Time</Form.Label>
                        <Form.Control as="select" required
                            name="startTime" value={data.startTime} onChange={handleInputChange}>
                            {times.map(startTime => {
                                return <option key={startTime}>{dayjs(startTime).format("HH:mm")}</option>
                            })}
                        </Form.Control>

                    </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                    Book Appointment
                </Button>
            </Form>
        </Container>
    )
}

export const Success = () => {
    const location = useLocation();
    return (
        <>
            <div className="text-center">
                {location.state.success
                    ? <FontAwesomeIcon icon="check-circle" size="5x" color="#72C341" className="mt-4 mb-2" />
                    : <FontAwesomeIcon icon="exclamation-circle" size="5x" color="#F2003C" className="mt-4 mb-2" />}
                <div className="my-2" >
                    {location.state.success
                        ? <>
                            <h1>Thank You!</h1>
                            <h3 className="font-weight-light">Your appointment has been booked</h3>
                        </>
                        : <>
                            <h1>Your appointment could not be booked.</h1>
                            <h3 className="font-weight-light">No appointments available for this startTime</h3>
                        </>}
                </div>
            </div>
        </>
    )
}