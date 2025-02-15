import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const DAI = await ethers.getContractAt("IERC20", DAIAddress);
  const ROUTER = await ethers.getContractAt("IUniswapV2Router02", UNIRouter);

  const amountTokenDesired = ethers.parseUnits("100", 18);
  const amountETHDesired = ethers.parseEther("1");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  await DAI.connect(impersonatedSigner).approve(UNIRouter, amountTokenDesired);

  const tx = await ROUTER.connect(impersonatedSigner).addLiquidityETH(
    DAIAddress,
    amountTokenDesired,
    0,
    0,
    impersonatedSigner.address,
    deadline,
    { value: amountETHDesired }
  );
  await tx.wait();

  console.log("addLiquidityETH executed!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
