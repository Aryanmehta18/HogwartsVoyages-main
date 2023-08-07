import React, { useState } from "react";
import { useParams } from "react-router-dom";
import config from "./config";
import './payment2.css'
const url = config.apiUrl;

const Payment2Form = () => {
    const { airline, seats, username, date, price } = useParams();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [upiId, setUpiId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handlePaymentSubmit = async () => {
        try {
            const response = await fetch(
                url +
                `/api/flightsuserup/?q=${airline}&new=${seats}&uid=${username}&date=${date}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.updated === "Not Enough seats") {
                setErrorMessage("Not Enough Seats");
            } else {
                setErrorMessage("Booked!");
            }
        } catch (error) {
            console.error("Error booking seats:", error);
        }
    };

    return (
        <div className="payment-page-container">
            <h3>Payment Method:</h3>
            <div className="payment-type-1">
                <label htmlFor="cardPayment">Card Payment</label>
                <input
                    type="radio"
                    id="cardPayment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                />
            </div>
            <div >
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
                <div>
                    <h3>Card Payment Details</h3>
                    <label htmlFor="cardNumber">Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <label htmlFor="expiryDate">Expiry Date:</label>
                    <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <label htmlFor="cvv">CVV:</label>
                    <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>
            )}

            {paymentMethod === "upi" && (
                <div>
                    <h3>UPI Payment Details</h3>
                    <label htmlFor="upiId">UPI ID:</label>
                    <input
                        type="text"
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                    />
                </div>
            )}
            <button type="submit" onClick={handlePaymentSubmit}>
                Pay ${price}
            </button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};
export default Payment2Form;