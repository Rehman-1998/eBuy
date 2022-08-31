const express = require("express");
const router = express.Router();

const mailchimp = require("../../services/mailchimp");
const mailgun = require("../../services/mailgun");
const sgMail = require("@sendgrid/mail");
const { newsletterSubscriptionEmail } = require("../../config/template");

router.post("/subscribe", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "You must enter an email address." });
  }

  const result = await mailchimp.subscribeToNewsletter(email);

  if (result.status === 400) {
    return res.status(400).json({ error: result.title });
  }

  sgMail.send(newsletterSubscriptionEmail(email)).then(
    (success) => {
      console.log("success====>", success);
    },
    (error) => {
      console.error("Error======>", error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
  // await mailgun.sendEmail(email, 'newsletter-subscription');

  res.status(200).json({
    success: true,
    message: "You have successfully subscribed to the newsletter",
  });
});

module.exports = router;
