import React, { useState, useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';
import './flights.css'; // Import your custom CSS for styling
import config from "./config";
const url = config.apiUrl;

const Flights = () => {
    const { departure, arrival, username, departureDate } = useParams();
    const [flightsData, setFlightsData] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState(0);


    const handleSearch = async () => {
        try {
            const response = await fetch(
                url + `/api/searchflights/?d=${departure}&a=${arrival}&date=${departureDate}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            var data = await response.json();
            if (data.error === "search error") {
            } else if (data.error === "no flights") {
            } else {
                setFlightsData(data);
            }
        } catch (error) {
            console.error("Search error");
        }
    };


    useEffect(() => {
        handleSearch();
    }, [departure, arrival]);

    return (
        <div className="flights-container">
            <h2 className="flights-heading">Flights</h2>

            {/* Display departure and arrival information */}
            <div className="flight-details">
                <h3 className="departure-arrival-heading">Departure: {departure}</h3>
                <h3 className="departure-arrival-heading">Arrival: {arrival}</h3>
            </div>

            {/* Add date inputs for selecting departure and return dates */}



            {/* Center the flight list */}
            <div className="flights-list-container">

                {flightsData.length > 0 ? (
                    <div className="flights-list">
                        {flightsData.slice().reverse().map((flight) => (
                            <div key={flight.id} className="flight-card">



                                <div className="flight-info">
                                    <div className="flight-symbol">✈</div>
                                    <div className='head-text3'>
                                        HogwartsVoyages
                                    </div>
                                    <p className="flight-number">Flight Number:{flight.flight_number}</p>
                                    <p className="airline-name">Airline: {flight.airline}</p>
                                    <p>Date: {flight.date}</p>
                                    <div className="flight-line-container">
                                        <div className="flight-line" />
                                    </div>
                                    <p className="flight-time">Departure Time: {flight.departure_time}</p>
                                    <p className="flight-time">Arrival Time: {flight.arrival_time}</p>
                                </div>
                                <div className="flight-price">
                                    <p>Price: {flight.price}</p>
                                </div>
                                <div className='seats'>
                                    No Of Passengers:
                                </div>
                                    
                               
                                <input
                                    
                                    type="text"
                                    className="seats-input"
                                    placeholder="Seats"
                                    value={selectedSeats}
                                    onChange={(e) => setSelectedSeats(e.target.value)}
                                    />
                                
                                <Link
                                    to={`/pay2/${flight.airline}/${selectedSeats}/${username}
                                  /${flight.departure_date}/${parseInt(flight.price) * parseInt(selectedSeats)
                                        }`}
                                >
                                    <button className="book-button4">Book Now!</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-flights-message">No flights available.</p>
                )}
            </div>
        </div>
    );
};

export default Flights;