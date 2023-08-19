const crypto = require("crypto");
const EC = require("elliptic").ec;
const keccak256 = require("keccak256");

// Initialize elliptic curve
const ec = new EC("secp256k1");

// Private Key
const privateKey =
  "503051fd9758f8301805e867cca12d34634e9ffccf17fb7e709ed2cd8a48ddd4"; // Replace this with your actual key if different
const keyPair = ec.keyFromPrivate(privateKey);

// Generate Public Key
const publicKey = keyPair.getPublic(false, "hex").slice(2); // get the public key in uncompressed form (remove the first byte)
console.log("Public Key (hex):", publicKey);

// Generate Address
const publicHash = keccak256(Buffer.from(publicKey, "hex"));
const address = "0x" + publicHash.slice(-20).toString("hex");
console.log("Address:", address);

//Output: Public Key (hex): 5080154d412f0f36626df919c0f621262c93d09299ba510e8f304284a8380c18158e6196866ed550f2f9f7278bdf36398b750a5677cbc4be81ccf4cfc37d1d57
// Address: 0x98fb053c78c217c7debfd356e1676801411f499f
