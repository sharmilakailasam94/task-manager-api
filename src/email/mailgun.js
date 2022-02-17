var api_key = "f757805961618c0c6588fa6741b1da57-c3d1d1eb-7cc22d22";
var domain = "https://api.mailgun.net/v3/sandbox2c24e10cfb6c4cc99dc8aa4dc6c342a9.mailgun.org://app.mailgun.com/app/sending/domains/sandbox2c24e10cfb6c4cc99dc8aa4dc6c342a9.mailgun.org";
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
 
var data = {
  from: "Excited User <me@samples.mailgun.org>",
  to: "sharmilakailasam@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomeness!",
};
console.log(mailgun);
mailgun.messages().send(data, function (error, body) {
  console.log(body);
  console.log(error);
});


