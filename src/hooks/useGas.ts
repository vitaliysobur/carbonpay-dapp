import { useContext, useState, useEffect } from "react";
import { WalletContext } from "@/context/WalletContext";
import { getGas } from "@/services/contracts";

const useGas = () => {
  const { address, kit } = useContext(WalletContext);
  const [gas, setGas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const updateGas = async () => {
      if (address) {
        const gas = await getGas(kit, address);

        if (isMounted) {
          setGas(gas);
          setIsLoading(false);
        }
      }
    };

    updateGas();

    return () => {
      isMounted = false;
    };
  }, [address, kit]);

  return {
    gas,
    isLoading,
  };
};

export default useGas;
