const Stripe = require("stripe");
const config = process.env;
const stripe = Stripe(config.STRIPE_SECRET_TEST);

// Stripe payment Intent craete API.
const craeteIntent = async (req, res, next) => {
  try {
    var stripeToken = req.body.token;

    const paymentRetrieve = await stripe.paymentIntents.retrieve(stripeToken);
    console.log(paymentRetrieve, "retrieve");
    return res.send({ msg: paymentRetrieve });
  } catch (err) {
    res.send(err);
  }
};

// Stripe payment API.
const confirmPayment = async (req, res, next) => {
  try {
    const { stripetoken } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(stripetoken, {
      payment_method: ["card"],
    });

    return res.send({ paymentIntent });
  } catch (error) {
    console.log(error, "ERROR");
    return res.send({
      status: false,
      error: error,
      message: "Payment failed",
    });
  }
};

module.exports = { craeteIntent, confirmPayment };
