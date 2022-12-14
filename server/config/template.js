exports.resetEmail = ({ host, resetToken, email }) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Reset Password",
    text:
      `${
        "You are receiving this because you have requested to reset your password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://"
      }${host}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  return message;
};

exports.confirmResetPasswordEmail = ({ email }) => {
  console.log("IN CFC", email);
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Password Changed",
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`,
  };

  return message;
};

exports.merchantSignup = ({ host, resetToken, email }) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Merchant Registration",
    text: `${
      "Congratulations! Your application has been accepted. Please complete your Merchant account signup by clicking on the link below. \n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "http://"
    }${host}/merchant-signup/${resetToken}?email=${email}\n\n`,
  };

  return message;
};

exports.merchantWelcome = ({ email, name }) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Merchant Registration",
    text:
      `Hi ${name}! Congratulations! Your application for merchant account has been accepted. \n\n` +
      `It looks like you already have a member account with us. Please sign in with your member credentials and you will be able to see your merchant account.`,
  };

  return message;
};

exports.signupEmail = ({ email, firstName, lastName }) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Account Registration",
    text: `Hi ${firstName} ${lastName}! Thank you for creating an account with us!.`,
  };

  return message;
};

exports.newsletterSubscriptionEmail = (email) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Newsletter Subscription",
    text:
      `You are receiving this email because you subscribed to our newsletter. \n\n` +
      `If you did not request this change, please contact us immediately.`,
  };

  return message;
};

exports.contactEmail = () => {
  const message = {
    subject: "Contact Us",
    text: `We received your message! Our team will contact you soon. \n\n`,
  };

  return message;
};

exports.merchantApplicationEmail = (email) => {
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    subject: "Sell on eBuy Store",
    text: `We received your request! Our team will contact you soon. \n\n`,
  };

  return message;
};

exports.orderConfirmationEmail = ({ email, _id, name, products }) => {
  console.log("IN Order", products);
  let orderProduct = products.map((item) => ({
    Product: item.product.name,
    staus: item.status,
    quantity: item.quantity,
    price: item.product.price,
  }));
  let jsonData = JSON.stringify(orderProduct);
  console.log("object", orderProduct);
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    // subject: `Order Confirmation ${order._id}`,
    subject: `Order Confirmation ${_id}`,
    text:
      `Hi ${name}! Thank you for your order!. \n\n` +
      `We've received your order ${jsonData} and will contact you as soon as Possible. \n\n`,
  };

  return message;
};

exports.orderEmailToMerchant = ({ email, _id, buyer, products }) => {
  console.log("IN Merchant EMail =====>", products, buyer);
  let orderProduct = {
    Name: products.product.name,
    quantity: products.quantity,
    price: products.totalPrice,
  };
  let buyerObj = {
    firstName: buyer.firstName,
    lastName: buyer.lastName,
    email: buyer.email,
    phoneNumber: buyer.phoneNumber,
    address: buyer.address,
    city: buyer.city,
  };
  let jsonData = JSON.stringify(orderProduct);
  let buyerDetails = JSON.stringify(buyerObj);
  console.log("Merchant Mail Order Product ====>", orderProduct);
  const message = {
    to: email,
    from: "70070364@student.uol.edu.pk",
    // subject: `Order Confirmation ${order._id}`,
    subject: `Order Confirmation ${_id}`,
    text:
      `You got new order ! customer details ${buyerDetails} \n\n` +
      `Product Details : ${jsonData}  \n\n`,
  };

  return message;
};
