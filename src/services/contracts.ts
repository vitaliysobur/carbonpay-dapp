import carbonPayProcessorAbi from "@/abi/CarbonPayProcessor.json";
import carbonPayNftAbi from "@/abi/CarbonPayNFT.json";
import { AbiItem } from "web3-utils";
import {
  NFT_CONTRACT_ADDRESS,
  PAY_PROCESSOR_ADDRESS,
  TOKEN_ADDRESS,
} from "@/constants/constants";
import { MiniContractKit } from "@celo/contractkit/lib/mini-kit";

export const paymentProcessorContract = (kit: MiniContractKit) =>
  new kit.connection.web3.eth.Contract(
    carbonPayProcessorAbi as AbiItem[],
    PAY_PROCESSOR_ADDRESS
  );

export const nftContract = (kit: MiniContractKit) =>
  new kit.connection.web3.eth.Contract(
    carbonPayNftAbi as AbiItem[],
    NFT_CONTRACT_ADDRESS
  );

export const getGas = async (kit: MiniContractKit, address: string) => {
  const gasPrice = await kit.connection.web3.eth.getGasPrice();
  const gasEstimate = await paymentProcessorContract(kit)
    .methods.pay(
      address,
      TOKEN_ADDRESS,
      kit.connection.web3.utils.toWei("0", "ether")
    )
    .estimateGas();

  const gas = (Number(gasPrice) * gasEstimate) / 10 ** 18;
  return gas;
};

export const isValidAddress = (kit: MiniContractKit, address: string) => {
  return kit.connection.web3.utils.isAddress(address);
};

export const getMerchantName = async (
  kit: MiniContractKit,
  address: string
) => {
  const tokenId = await nftContract(kit)
    .methods.getTokenIdByAddress(address)
    .call();
  const name = (await nftContract(kit).methods.attributes(tokenId).call()).name;

  return name;
};
