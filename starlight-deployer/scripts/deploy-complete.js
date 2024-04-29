const hre = require("hardhat");
const fs = require("fs");
const saveMetadata = require("./metadata").saveMetadata;
require("dotenv").config({ path: __dirname + "/.env" });
const { BANKD_ADDRESS, ADMIN_ADDRESS } = process.env;

async function mint(erc20, to, amount) {
  console.log(`Minting Real Digital tokens to ${to} ...`);
  const tx = await erc20.mint(to, amount);
  const txReceipt = await tx.wait();
  if (txReceipt.status !== 1) {
    throw new Error(`Minting to ${to} failed`);
  }
  console.log(`Minting to ${to} has been successful`);
}

async function main() {

  console.log("Reading verification keys...");
  const vkInput = [];
  let vk = [];
  const functionNames = ["deposit", "transfer", "withdraw", "joinCommitments"];
  functionNames.forEach((name) => {
    const vkJson = JSON.parse(fs.readFileSync(`../orchestration/common/db/${name}_vk.key`, "utf-8"));
    if (vkJson.scheme) {
      vk = Object.values(vkJson).slice(2).flat(Infinity);
    } else {
      vk = Object.values(vkJson).flat(Infinity);
    }
    vkInput.push(vk);
  });
  console.log("Verification keys read.");

  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  console.log("Connected to network:", chainId);

  let blockNumber = await hre.ethers.provider.getBlockNumber();

  console.log("Deploying Verifier...");
  // const Verifier = await hre.ethers.getContractFactory("Verifier", { libraries: { Pairing: pairingAddress } });
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();  
  console.log("Verifier deployed to:", verifierAddress);
  // const verifierAddress = "0x05ed3d936290E1b7285a5638834e349D1B3FEE02";

  const [admin, , , , bankD] = await hre.ethers.getSigners();

  const erc20Data = {
    name: "Real Digital",
    symbol: "BRL",
    decimals: 2
  };

  blockNumber = await hre.ethers.provider.getBlockNumber();

  console.log("Deploying ERC20 using this data: ", erc20Data, "...");
  const ERC20 = await hre.ethers.getContractFactory("contracts/ERC20.sol:ERC20");
  let erc20 = await ERC20.deploy(
    erc20Data.name,
    erc20Data.symbol
  );
  await erc20.waitForDeployment();
  const erc20Address = await erc20.getAddress();
  console.log("ERC20 deployed to:", erc20Address);
  saveMetadata(erc20Address, "ERC20", chainId, blockNumber);

  await mint(erc20, ADMIN_ADDRESS, 100000000);
  await mint(erc20, BANKD_ADDRESS, 100000000);

  blockNumber = await hre.ethers.provider.getBlockNumber();
    
  console.log("Deploying EscrowShield ...");
  const EscrowShield = await hre.ethers.getContractFactory("EscrowShield");
  const escrowShield = await EscrowShield.deploy(erc20Address, verifierAddress, vkInput);
  await escrowShield.waitForDeployment();
  const escrowShieldAddress = await escrowShield.getAddress();
  console.log("EscrowShield deployed to:", escrowShieldAddress);
  saveMetadata(escrowShieldAddress, "EscrowShield", chainId, blockNumber);
  
  console.log("Approving Admin Real Digital tokens to Escrow contract ...");
  tx = await erc20.approve(escrowShieldAddress, 100000000);
  txReceipt = await tx.wait();
  if (txReceipt.status !== 1) {
    throw new Error(`Approving to ${escrowShieldAddress} failed`);
  }
  console.log(`Approving to Escrow contract has been successful`);

  erc20 = await hre.ethers.getContractAt("contracts/ERC20.sol:ERC20", erc20Address, bankD); 
  console.log("ERC20 for bankD is at:", await erc20.getAddress());
  console.log("Approving from BankA Real Digital tokens to Escrow contract ...");
  tx = await erc20.approve(escrowShieldAddress, 100000000);
  txReceipt = await tx.wait();
  if (txReceipt.status !== 1) {
    throw new Error(`Approving to ${escrowShieldAddress} failed`);
  }
  console.log(`Approving to Escrow contract has been successful`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
