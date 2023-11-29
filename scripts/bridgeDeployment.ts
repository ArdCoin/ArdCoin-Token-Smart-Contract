import { ethers } from "hardhat";

async function main() {
  const token = await ethers.deployContract("BridgedArdCoin");

  await token.waitForDeployment();

  console.log(`Bridge Token address - ${await token.getAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});