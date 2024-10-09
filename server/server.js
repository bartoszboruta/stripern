const stripe = require("stripe")("YOUR SECRET KEY HERE");
const express = require("express");
const app = express();

app.set("trust proxy", true);
app.use(express.json());

app.post("/create-intent", async (req, res) => {
  // TODO: uncomment this to test error handling
  // res.status(404).json({ error: "Not found" });
  // return;

  try {
    var args = {
      amount: 1099,
      currency: "usd",
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      payment_method: req.body.id,
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
