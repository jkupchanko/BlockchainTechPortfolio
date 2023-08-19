const crypto = require("crypto");
const privateKey = crypto.randomBytes(32);
console.log("Private Key (hex):", privateKey.toString("hex"));

//Output: Private Key (hex): 503051fd9758f8301805e867cca12d34634e9ffccf17fb7e709ed2cd8a48ddd4
