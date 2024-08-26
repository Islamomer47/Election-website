import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount }) => {
  const createOrder = (data, actions) => {
    return fetch("http://localhost:4000/api/orders", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert("Transaction completed by " + details.payer.name.given_name);
    });
  };

  return (
    <div className="  p-4 bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          style={{ layout: "vertical" }} // Optional: changes the layout of PayPal buttons
        />
      </form>
    </div>
  );
};

export default PayPalButton;
