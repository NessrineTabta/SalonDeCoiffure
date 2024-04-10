const bcrypt = require("bcrypt");
const password = "password1234";

bcrypt.hash(password, 10, function (err, hash) {
  console.log(hash);
});
