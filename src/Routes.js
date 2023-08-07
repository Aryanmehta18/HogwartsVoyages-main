import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./home";
import Hotels from "./hotels";
import Flights from "./flights";
import HotelDetails from "./hotel_det";
import PaymentForm from "./payment";
import MyBookings from "./my_bookings";
import Payment2Form from "./payment2";
import QuizPage from "./quiz";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home/:username" element={<Home />} />
      <Route path="/hotels/:keyWord/:username" element={<Hotels />} />
      <Route
        path="flights/:departure/:arrival/:username/:departureDate"
        element={<Flights />}
      />
      <Route path="hotel/:id/:username" element={<HotelDetails />} />
      <Route path="pay/:id/:numRooms/:username/:discount" element={<PaymentForm />} />
      <Route
        path="pay2/:airline/:seats/:username/:date/:price"
        element={<Payment2Form />}
      />
      <Route path="mybookings/:username" element={<MyBookings />} />
      <Route path="quiz/:id/:username/:numRooms" element={<QuizPage />} />
    </Routes>
  );
};

export default AppRoutes;