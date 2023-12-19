const Mailgen = require("mailgen");

const generateEmail = async (params) => {
  //configure mailgen
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Chat Magic Team",
      link: "https://mailgen.js/",
    },
  });

  //generate message template
  var email = {
    body: {
      name: params.name,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions:
          "Click the button below to reset your password. The link will be valid for only 10 minutes",
        button: {
          color: "#DC4D2F",
          text: "Reset your password",
          link: params.resetLink,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };

  //Generate HTML message
  return await mailGenerator.generate(email);
};

module.exports = generateEmail;
