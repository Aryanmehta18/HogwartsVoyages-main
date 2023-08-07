import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import { useNavigate } from "react-router-dom";
import config from "./config.js";
const url = config.apiUrl;
// import logoImage from './HOGWARTVOYAGES.png';

const Home = () => {
    const { username } = useParams();
    const [selectedOption, setSelectedOption] = useState("hotels");
    const [keyWord, setKeyWord] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('')
    const navigate = useNavigate();
    const [suggestionsList, setSuggestions] = useState([]);
    const slideshowImages = [
        require("./home_bot.png"),
        require("./HOGWARTVOYAGES.png"),
       
        // Add more image URLs here
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to handle slideshow navigation
    const handleNextSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
        );
    };
    const fetchSuggestionsHotel = async (query) => {
        try {
            const response = await fetch(url + `/api/suggestions_hotel/?q=${query}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setSuggestions(data);
            
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const fetchSuggestionsFlightFrom = async (query) => {
        try {
            const response = await fetch(
                url + `/api/suggestions_flightfrom/?q=${query}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const fetchSuggestionsFlightTo = async (query) => {
        try {
            const response = await fetch(
                url + `/api/suggestions_flightto/?q=${query}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
        }, 2000); // Change slide every 5 seconds (adjust as needed)

        return () => clearInterval(interval);
    }, [slideshowImages.length]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const nav = () => {
        if (selectedOption === "hotels") {
            navigate(`/hotels/${keyWord}/${username}`);
        } else if (selectedOption === "flights") {
            navigate(`/flights/${departure}/${arrival}/${username}/${departureDate}`);
        }
    };

    const handleMyBookingsClick = () => {
        navigate(`/mybookings/${username}`);
    };

    return (
        <div className="home-container">
            <h1 className="login-t">Welcome, {username}!</h1>
            <button className="my-bookings-button " onClick={handleMyBookingsClick}>
                My Bookings
            </button>
            <div className="options-container">
                <button
                    className={`option-button ${selectedOption === "hotels" ? "active" : ""
                        }`}
                    onClick={() => handleOptionClick("hotels")}
                >
                    Hotels
                </button>
                <button
                    className={`option-button ${selectedOption === "flights" ? "active" : ""
                        }`}
                    onClick={() => handleOptionClick("flights")}
                >
                    Flights
                </button>
                <button
                    className={`option-button ${selectedOption === "holidayPackages" ? "active" : ""
                        }`}
                    onClick={() => handleOptionClick("holidayPackages")}
                >
                    Holiday Packages
                </button>
            </div>
            <div className="search-container">
                {selectedOption === "flights" ? (
                    <div>
                        <input
                            type="text"
                            list="suggestions"
                            className="search-input-flights"
                            placeholder="Departure"
                            value={departure}
                            onChange={(e) => {
                                setDeparture(e.target.value);
                                fetchSuggestionsFlightFrom(e.target.value);
                            }}
                            
                        />
                        <datalist id="suggestions">
                            {" "}
                            {suggestionsList.map((suggestion, index) => (
                                <option key={index} value={suggestion} />
                            ))}
                        </datalist>
                        <input
                            type="text"
                            className="search-input-flights"
                            list="suggestions"
                            placeholder="Arrival"
                            value={arrival}
                            onChange={(e) => {
                                setArrival(e.target.value);
                                fetchSuggestionsFlightTo(e.target.value);
                            }}
                        />
                        <datalist id="suggestions">
                            {" "}
                            {suggestionsList.map((suggestion, index) => (
                                <option key={index} value={suggestion} />
                            ))}
                        </datalist>
                        <input
                            type="date"
                            className="search-input-flights"
                            placeholder="Departure Date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            
                        />
                        
                    </div>


                ) : (
                        <div >
                    <input
                                type="text"
                                list="suggestions"
                        className="search-input-flights"
                        placeholder="Enter Your Destination"
                        value={keyWord}
                            onChange={(e) => {
                                setKeyWord(e.target.value);
                                fetchSuggestionsHotel(e.target.value);
                            }}
                        />
                        <datalist id="suggestions">
                            {" "}
                            {suggestionsList.map((suggestion, index) => (
                                <option key={index} value={suggestion} />
                            ))}
                            </datalist>
                            </div>
                )}
                            
                <button className="search-button" onClick={nav}>
                    Search
                </button>
                <div className="explore">

                    Explore Enchanting Destinations on HogwartsVoyages!
                </div>
               
               
            </div>
        </div>
    );
};

export default Home;


