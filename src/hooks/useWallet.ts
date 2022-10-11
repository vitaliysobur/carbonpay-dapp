import { Maybe, useCelo } from "@celo/react-celo";
import { useCallback, useEffect, useState } from "react";
import { nftContract } from "@/services/contracts";
import { MiniContractKit } from "@celo/contractkit/lib/mini-kit";

const useWallet = () => {
  const [isRegistered, setRegistered] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { kit, address, connect, destroy } = useCelo();

  const getRegisteredState = useCallback(
    async (kit: MiniContractKit, address: Maybe<string>) => {
      if (!address) return false;

      try {
        const contract = nftContract(kit);
        const balance = await contract.methods.balanceOf(address).call();
        return balance > 0;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    await destroy();
  }, [destroy]);

  useEffect(() => {
    let isMounted = true;

    const checkRegistration = async () => {
      setLoading(true);
      const isRegistered = await getRegisteredState(kit, address);

      if (isMounted) {
        setRegistered(isRegistered);
        setLoading(false);
      }
    };

    checkRegistration();

    return () => {
      isMounted = false;
    };
  }, [kit, address, getRegisteredState]);

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
