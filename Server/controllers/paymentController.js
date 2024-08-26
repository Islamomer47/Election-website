// Import the Stripe configuration module
const stripe = require("../config/stripe");

// Import the Advertisement model from the models directory
const { Advertisement } = require("../models");

// Function to create a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    // Destructure the ad_id, total_amount, and payment_method_id from the request body
    const { ad_id, total_amount, payment_method_id } = req.body;

    // Check if any required fields are missing
    if (!ad_id || !total_amount || !payment_method_id) {
      return res.status(400).json({
        error: "ad_id, total_amount, and payment_method_id are required",
      });
    }

    // Find the advertisement by its primary key (ad_id)
    const advertisement = await Advertisement.findByPk(ad_id);

    // If the advertisement is not found, return a 404 error
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_amount), // Round and set the total amount to be charged
      currency: "usd", // Set the currency to USD
      payment_method: payment_method_id, // Use the provided payment method ID
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true, // Enable automatic payment methods
        allow_redirects: "never", // Disable redirects for the payment process
      },
    });

    // Update the advertisement with the Stripe payment intent ID
    await advertisement.update({
      stripeChargeId: paymentIntent.id, // Set the Stripe charge ID
    });

    // Send a success response with the payment intent ID
    res.status(200).json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (error) {
    // If an error occurs, log it and return a 500 error response
    console.error("Payment error:", error);
    res.status(500).json({ error: error.message || "Payment failed" });
  }
};
