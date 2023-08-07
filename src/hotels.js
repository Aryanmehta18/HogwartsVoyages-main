import React, { useState,useEffect } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import config from "./config";
import './Hotels.css'
import VideoSource from './video.mp4';

const url = config.apiUrl;

const Hotels = () => {
    const { keyWord,username} = useParams();
    const [hotelsData, setHotelsData] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numPassengers, setNumPassengers] = useState(1);
    // const [dataList, setDataList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [sortOption, setSortOption] = useState('lowestToHighest');

    const handleSearch = async () => {
        try {
            const response = await fetch(url + `/api/searchhotels/?q=${keyWord}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            var data = await response.json();
            if (data.error === 'search error') {
                setErrorMessage("Something went wrong");
            } else if (data.error === "no hotels") {
                setErrorMessage("No Hotels found");
            } else {
                // Sort the data based on the price property
                if (sortOption === 'lowestToHighest') {
                    data.sort((a, b) => a.price - b.price);
                } else {
                    data.sort((a, b) => b.price - a.price);
                }

                // Update the sorted data list
                setHotelsData(data);
            }
        } catch (error) {
            console.error("Search error");
        }
    };
    

   


    useEffect(() => {
        handleSearch();
    }, [keyWord, sortOption]);

    console.log(hotelsData)

    return (
        <div classname="hotels-container">
            <div className="hotels-container">
                <div className="sort-container">
                    <button onClick={() => setSortOption('lowestToHighest')}>Lowest to Highest Price</button>
                    <button onClick={() => setSortOption('highestToLowest')}>Highest to Lowest Price</button>
                </div>
        
            <h2 className="hotels-heading">Hotels</h2>
            {/* Add check-in, check-out dates, and number of passengers */}
                <div className="search-co2">
                    
                <div className="search-input-co2">
                    <label htmlFor="checkInDate">Check-in Date:</label>
                    <input
                        type="date"
                        id="checkInDate"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                    />
                </div>
                <div className="search-input-co2">
                    <label htmlFor="checkOutDate">Check-out Date:</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                </div>
                <div className="search-input-co2">
                    <label htmlFor="numPassengers">Number of Passengers:</label>
                    <input
                        type="number"
                        id="numPassengers"
                        min="1"
                        value={numPassengers}
                        onChange={(e) => setNumPassengers(parseInt(e.target.value))}
                    />
                </div>
            </div>
            <div className="hotels-list">

                    {hotelsData.map((hotel) => (
                    console.log(hotel.pic),
                    <div key={hotel.id} className="hotel-card">
                        {/* <div className="hotel-photo">
                            
                        </div> */}
                        <div >
                            <img className="hotel-photo"src={hotel.pic} alt={hotel.name} />
                        </div>
                        <div className="hotel-details">
                            <h3 className="hotel-name">{hotel.name}</h3>
                            <p className="hotel-location">{hotel.address}</p>
                        </div>

                        <div className="hotel-price">
                            <label htmlFor='price'>Price/Night:</label>
                            <p>{hotel.price}</p>
                        </div>
                        <Link to={`/hotel/${hotel.id}/${username}`}>
                            <button className="book-now-btn">Book Now!</button>
                        </Link>
                    </div>
                ))}
                    <div className="video-container">
                        <video autoPlay loop muted>
                            <source src={VideoSource} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
            </div>
            </div>
            </div>
    );
};

export default Hotels;