import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import Cookies from 'js-cookie'
import dayjs from 'dayjs';
import Flatpickr from "react-flatpickr";
import { Container, Row, Col, Table, Button, Spinner } from 'react-bootstrap';
import { getNextBusinessDay } from "../utils/getNextBusinessDay";

const Dashboard = ({ loggedIn, updateLoggedIn }) => {
    return (
        <Container>
            {!loggedIn && <LoginForm updateLoggedIn={updateLoggedIn} />}
            {loggedIn && <Reservations />}
        </Container>
    )
}

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [date, setDate] = useState(getNextBusinessDay());

    useEffect(() => {
        axios.get(`/reservations?date=${date}&sort=asc`,
            {
                headers: { "Authorization": Cookies.get("token") }
            })
            .then(res => { setReservations(res.data) })
            .catch(err => console.log(err))

        setIsLoading(false);
    }, [date])

    const removeReservationRow = id => {
        const temp = reservations.filter(res => id !== res._id);
        setReservations(temp);
    }

    return (
        <>
            <Row className="mb-4">
                <Col md={6}>
                    <h3>Reservations</h3>
                </Col>
                <Col md={6}>
                    <Flatpickr
                        value={date}
                        options={{
                            altInput: true,
                            altInputClass: "form-control bg-white",
                            disable: [function (date) {
                                return (date.getDay() === 0 || date.getDay() === 6);
                            }]
                        }}
                        onChange={d => setDate(dayjs(d).format("YYYY-MM-DD"))}
                    />
                </Col>
            </Row>

            {isLoading
                ? <LoadingSpinner />
                : <ReservationsTable reservations={reservations} removeReservationRow={removeReservationRow} isLoading={isLoading} />
            }
        </>
    )
}


const ReservationsTable = ({ reservations, removeReservationRow }) => {
    const removeReservation = id => {
        axios.delete(`/reservations/${id}`,
            {
                headers: { "Authorization": Cookies.get("token") }
            })
            .then(() => removeReservationRow(id))
            .catch(err => console.log(err))
    }
    return (
        <>
            {reservations.length === 0
                ? <p className="lead">No reservations on this day</p>
                : <Table responsive hover>
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(reservation => {
                            return (
                                <tr key={reservation._id}>
                                    <td className="align-middle">{dayjs(reservation.startTime).format("HH:mm")}</td>
                                    <td className="align-middle">{reservation.firstName}</td>
                                    <td className="align-middle">{reservation.lastName}</td>
                                    <td className="align-middle">{reservation.email}</td>
                                    <td className="align-middle"><Button variant="danger" onClick={() => removeReservation(reservation._id)}>Remove</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            }
        </>
    )
}

const LoadingSpinner = () => {
    return (
        <div className="text-center my-4">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )

}

export default Dashboard;