import { useCelo } from "@celo/react-celo";
import { useCallback, useEffect, useState } from "react";
import CarbonPayNFTAbi from "@/abi/CarbonPayNFT.json";
import { NFT_CONTRACT_ADDRESS } from "@/constants/constants";
import { AbiItem } from "web3-utils";

const useWallet = () => {
  const [isRegistered, setRegistered] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { kit, address, connect, destroy } = useCelo();

  const getRegisteredState = useCallback(async () => {
    if (!address) return false;

    try {
      const contract = new kit.connection.web3.eth.Contract(
        CarbonPayNFTAbi as AbiItem[],
        NFT_CONTRACT_ADDRESS
      );
      const balance = await contract.methods.balanceOf(address).call();
      return balance > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }, [kit.connection.web3.eth.Contract, address]);

  const disconnect = useCallback(async () => {
    await destroy();
  }, [destroy]);

  useEffect(() => {
    let isMounted = true;

    const checkRegistration = async () => {
      setLoading(true);
      const isRegistered = await getRegisteredState();

      if (isMounted) {
        setRegistered(isRegistered);
        setLoading(false);
      }
    };

    checkRegistration();

    return () => {
      isMounted = false;
    };
  }, [getRegisteredState]);

  return {
    address,
    kit,
    connect,
    disconnect,
    isRegistered,
    isLoading,
  };
};

export default useWallet;
