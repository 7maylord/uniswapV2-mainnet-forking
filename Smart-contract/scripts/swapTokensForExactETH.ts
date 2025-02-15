import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const USDC = await ethers.getContractAt("IERC20", USDCAddress);
  const ROUTER = await ethers.getContractAt("IUniswapV2Router02", UNIRouter);

  const amountOut = ethers.parseUnits("100", 18);
  const amountInMax = ethers.parseUnits("110", 6);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  await USDC.connect(impersonatedSigner).approve(UNIRouter, amountInMax);

  const tx = await ROUTER.connect(impersonatedSigner).swapTokensForExactETH(
    amountOut,
    amountInMax,
    [USDCAddress, wethAddress],
    impersonatedSigner.address,
    deadline
  );
  await tx.wait();

  console.log("swapTokensForExactETH executed!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
