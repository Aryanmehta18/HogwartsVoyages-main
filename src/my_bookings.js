import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "./config";

const url = config.apiUrl;

const MyBookings = () => {
    const { username } = useParams();
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(url + `/api/mybookings/?q=${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setBookings(data);
            console.log(bookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    });

    return (
        <div>
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {/* {bookings.map((booking) => ( */}
                    <li key={bookings.id}>
                        Hotel: {bookings.hotelid}, Check-in Date: {bookings.cindate},
                        Check-out Date: {bookings.coutdate}, Payment: {bookings.payment}
                    </li>
                    {/* ))} */}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;