// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const namehash = require('@ensdomains/eth-ens-namehash');
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const tld = "test";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
  const ens = await ENSRegistry.deploy();
  await ens.deployed();
  console.log("ENSRegistry address:", ens.address);

  // const PublicResolver = await ethers.getContractFactory("PublicResolver")
  // const resolver = await PublicResolver.deploy(ens.address, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS);
  // await resolver.deployed()
  // console.log("PublicResolver address:", resolver.address);
  
  const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar");
  const registrar = await FIFSRegistrar.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed();
  await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
  console.log("FIFSRegistrar address:", registrar.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(ens, registrar);
}

function saveFrontendFiles(ens, registrar) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ ENSRegistry: ens.address, FIFSRegistrar: registrar.address }, undefined, 2)
  );

  const ENSRegistryArtifact = artifacts.readArtifactSync("ENSRegistry");
  fs.writeFileSync(
    path.join(contractsDir, "ENSRegistry.json"),
    JSON.stringify(ENSRegistryArtifact, null, 2)
  );

  // const PublicResolverArtifact = artifacts.readArtifactSync("PublicResolver");
  // fs.writeFileSync(
  //   path.join(contractsDir, "PublicResolver.json"),
  //   JSON.stringify(PublicResolverArtifact, null, 2)
  // );

  const FIFSRegistrarArtifact = artifacts.readArtifactSync("FIFSRegistrar");
  fs.writeFileSync(
    path.join(contractsDir, "FIFSRegistrar.json"),
    JSON.stringify(FIFSRegistrarArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
