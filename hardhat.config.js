require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// To import private key from .env
const fs = require("fs");
const privateKey = fs.readFileSync(".env").toString().trim() || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "spark",
  networks: {
    spark: {
      chainId: 123,
      url: "https://rpc.fusespark.io",
      accounts: [privateKey],
      gasPrice: 11000000000,
    },
    fuse: {
      url: "https://rpc.fuse.io",
      chainId: 122,
      accounts: [privateKey],
      gasPrice: 11000000000,
    },
  },
  solidity: "0.8.17",
};
