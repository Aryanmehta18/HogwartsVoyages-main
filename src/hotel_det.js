import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "./config";
import "./HotelDetails.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSwimmingPool,
    faUtensils,
    faWifi,
    faMagic,
    faQuidditch,
    faBroom,
    faHatWizard,
    faChessKnight,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

const url = config.apiUrl;

const HotelDetails = () => {
    const { id, username } = useParams();
    const [hotel, setHotel] = useState(null);
    const [rating, setRating] = useState(0);
    const [numRooms, setNumRooms] = useState(1);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState("");

    const handleNumRoomsChange = (e) => {
        setNumRooms(parseInt(e.target.value));
    };

    const handleCheckInDateChange = (e) => {
        setCheckInDate(e.target.value);
    };

    const handleCheckOutDateChange = (e) => {
        setCheckOutDate(e.target.value);
    };

    const fetchHotelDetails = async () => {
        try {
            const response = await fetch(url + `/api/gethotel/?q=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setHotel(data);

            // Set the background image URL based on the hotel ID
            const imageURL = `image-${data.id}`; // Assuming the filename is in the format "image-id" in the public folder
            setBackgroundImage(imageURL);
        } catch (error) {
            console.error("Error fetching hotel details:", error);
        }
    };

    const handlePaymentGate = () => {
        navigate(`/pay/${id}/${numRooms}/${username}/0`);
    };

    const Star = ({ selected, onClick }) => (
        <FontAwesomeIcon
            icon={faStar}
            onClick={onClick}
            style={{ cursor: "pointer", color: selected ? "gold" : "gray" }}
        />
    );

    const RatingStars = ({ selectedStars, onStarClick }) => (
        <div>
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    selected={index < selectedStars}
                    onClick={() => onStarClick(index + 1)}
                />
            ))}
        </div>
    );


    useEffect(() => {
        fetchHotelDetails();
    },[rating]);

    if (!hotel) {
        return <div>Loading...</div>;
    }
    const harryPotterActivities = [
        { icon: faMagic, name: "Wizarding Classes" },
        { icon: faQuidditch, name: "Quidditch Matches" },
        { icon: faBroom, name: "Broomstick Flying Lessons" },
        { icon: faHatWizard, name: "Sorting Hat Experience" },
        { icon: faChessKnight, name: "Wizard's Chess Tournaments" },
        // Add more Harry Potter related activities here if needed
    ];
    const updateRatings = async () => {
        try {
            const response = await fetch(url + `/api/postrv/?q=${id}&r=${rating}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error fetching hotel details:", error);
        }
    };

    return (
        <div className="hotel-details2-container2">
            <div>
                <img className="hotel-photo-det" src={hotel.pic} alt={hotel.name} />
            </div>
            <div className="hotel-details-content">
                <h2 className="hotel-name2">{hotel.name}</h2>
                <p className="hotel-address">Address: {hotel.address}</p>
                <p className="hotel-price2">Price: {hotel.price}</p>
                <div className="highlights-section">
                    <h3>Highlights:</h3>
                    <ul>
                        {harryPotterActivities.map((activity, index) => (
                            <li key={index}>
                                <FontAwesomeIcon icon={activity.icon} />
                                {activity.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="amenities-section">
                    <h3>Amenities:</h3>
                    <ul>
                        {hotel.amenities.map((amenity, index) => (
                            <li key={index}>
                                <FontAwesomeIcon icon={amenity.icon} />
                                {amenity}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="Ratings">
                    <h3>Ratings:</h3>
                    <div>
                        <p>Average Rating: {hotel.reviews}</p>
                        <p>Total Ratings: {hotel.numrev}</p>
                    </div>

                    <div>
                        <label htmlFor="rating">Rate Us:</label>
                        <RatingStars selectedStars={rating} onStarClick={setRating} />
                    </div>
                    <button className="submitreview" type="button" onClick={updateRatings}>
                        Submit Review
                    </button>
                </div>
                <div className="details">
                    <div>
                        <label htmlFor="numRooms">Number of Rooms:</label>
                        <input
                            type="number"
                            id="numRooms"
                            value={numRooms}
                            onChange={handleNumRoomsChange}
                            min={1}
                            max={10} // Set the maximum number of rooms allowed
                        />
                    </div>
                    <div>
                        <label htmlFor="checkInDate">Check-in Date:</label>
                        <input
                            type="date"
                            id="checkInDate"
                            value={checkInDate}
                            onChange={handleCheckInDateChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="checkOutDate">Check-out Date:</label>
                        <input
                            type="date"
                            id="checkOutDate"
                            value={checkOutDate}
                            onChange={handleCheckOutDateChange}
                        />
                    </div>
                        
                </div>
                <div className="Booking">
                    <button type="submit" onClick={handlePaymentGate}>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;