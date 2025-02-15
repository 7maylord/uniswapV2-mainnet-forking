import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const ROUTER = await ethers.getContractAt("IUniswapV2Router02", UNIRouter);

  const amountOutMin = ethers.parseUnits("90", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await ROUTER.connect(impersonatedSigner).swapExactETHForTokens(
    amountOutMin,
    [wethAddress, DAIAddress],
    impersonatedSigner.address,
    deadline,
    { value: ethers.parseEther("1") }
  );
  await tx.wait();

  console.log("swapExactETHForTokens executed!");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
