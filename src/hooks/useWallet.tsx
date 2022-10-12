import { Maybe, useCelo } from "@celo/react-celo";
import { useCallback, useEffect, useState } from "react";
import { nftContract, paymentProcessorContract } from "@/services/contracts";
import { MiniContractKit } from "@celo/contractkit/lib/mini-kit";
import { TOKEN_ADDRESS } from "@/constants/constants";
import { toast } from "react-toastify";
import TransactionLink from "@/components/TransactionLink";

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

  const pay = useCallback(
    async (merchantAddress: string, amount: string) => {
      try {
        await paymentProcessorContract(kit)
          .methods.pay(
            merchantAddress,
            TOKEN_ADDRESS,
            kit.connection.web3.utils.toWei(amount, "ether")
          )
          .send({ from: address })
          .on("transactionHash", function (hash: string) {
            toast.info(() => <TransactionLink hash={hash} />);
          });
      } catch (err) {
        console.log(err);
        if (/4001/.test(err as string)) {
          console.log("Rejected");
        } else {
          !address && (await connect());
        }
      }
    },
    [address, connect, kit]
  );

  const isValidAddress = useCallback(
    (address: string) => {
      return kit.connection.web3.utils.isAddress(address);
    },
    [kit]
  );

  const getMerchantName = useCallback(
    async (address: string) => {
      const tokenId = await nftContract(kit)
        .methods.getTokenIdByAddress(address)
        .call();
      const name = (await nftContract(kit).methods.attributes(tokenId).call())
        .name;

      return name;
    },
    [kit]
  );

  return {
    address,
    kit,
    pay,
    connect,
    disconnect,
    isRegistered,
    isLoading,
    isValidAddress,
    getMerchantName,
  };
};

export default useWallet;
