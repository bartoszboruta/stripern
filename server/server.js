const stripe = require("stripe")("YOUR_KEY_HERE");
const express = require("express");
const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.post("/create-intent", async (req, res) => {
  try {
    var args = {
      amount: 1099,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      confirm: true,
    };
    const intent = await stripe.paymentIntents.create(args);

    res.json({
      client_secret: intent.client_secret,
    });
  } catch (err) {
    res.status(err.statusCode).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
