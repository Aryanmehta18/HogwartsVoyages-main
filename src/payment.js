import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "./config";

import './payment.css'
const url = config.apiUrl;

const PaymentForm = () => {
    const { id, numRooms, username, discount } = useParams();
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [upiId, setUpiId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");

    const handleCheckInDateChange = (e) => {
        setCheckInDate(e.target.value);
    };
    const navigate = useNavigate();

    const handleCheckOutDateChange = (e) => {
        setCheckOutDate(e.target.value);
    };
    const navToQuiz = async () => {
        navigate(`/quiz/${id}/${username}/${numRooms}`);
    };

    const calPrice = async () => {
        try {
            const response = await fetch(url + `/api/gethotel/?q=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            const price = parseInt(data.price);
            setTotalPrice(parseInt(numRooms) * price);
        } catch (error) {
            console.error("Error fetching hotel details:", error);
        }
    };

    useEffect(() => {
        calPrice();
    });

    const handlePaymentSubmit = async () => {
        try {
            const response = await fetch(
                url + `/api/userup/?q=${id}&new=${numRooms}&uid=${username}&in=${checkInDate}&out=${checkOutDate}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.updated === "Not Enough Rooms") {
                setErrorMessage("Not Enough Rooms");
            } else {
                setErrorMessage("Booked!");
            }
        } catch (error) {
            console.error("Error booking rooms:", error);
        }
    };

    return (
        <div className="payment-page-container">

            <h3>Payment Method:</h3>
            <div className="card-payment">
                <label htmlFor="cardPayment">Card Payment</label>
                <input
                    type="radio"
                    id="cardPayment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                />
            </div>
            <div className="upi-payment">
                <label htmlFor="upiPayment">UPI Payment</label>
                <input
                    type="radio"
                    id="upiPayment"
                    value="upi"

                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                />
            </div>

            {paymentMethod === "card" && (
                <div className="payment-details">
                    <h3>Card Payment Details</h3>
                    <label htmlFor="cardNumber">Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        className="card-info"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <label htmlFor="expiryDate">Expiry Date:</label>
                    <input
                        type="text"
                        id="expiryDate"
                        className="card-info"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <label htmlFor="cvv">CVV:</label>
                    <input
                        type="text"
                        id="cvv"
                        className="card-info"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>

            )}


            {paymentMethod === "upi" && (
                <div className="upi-details">
                    <h3>UPI Payment Details</h3>
                    <label htmlFor="upiId">UPI ID:</label>
                    <input
                        type="text"
                        id="upiId"
                        className="upi-check"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                    />
                </div>
            )}
            <div className="payment-checkin">
                <label htmlFor="checkInDate">Check-in Date:</label>
                <input
                    type="date"
                    id="checkInDate"
                    value={checkInDate}
                    onChange={handleCheckInDateChange}
                />
            </div>
            <div className="payment-checkout">
                <label htmlFor="checkOutDate">Check-out Date:</label>
                <input
                    type="date"
                    id="checkOutDate"
                    value={checkOutDate}
                    onChange={handleCheckOutDateChange}
                />
            </div>

            <button className="pay-submit" type="submit" onClick={handlePaymentSubmit}>
                Pay ${totalPrice - parseInt(discount)}
            </button>
            <button className="quiz" onClick={navToQuiz}>
                To avail discount click this
            </button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>

    );
};

export default PaymentForm;