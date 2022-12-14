import { Alfajores, useCelo } from '@celo/react-celo';

export const useWallet = () => {
  const {
    address,
    connect: connectFromHook,
    destroy,
    network: walletNetwork
  } = useCelo();

  const network = Alfajores;
  const wrongNetwork = network?.chainId !== walletNetwork?.chainId;

  const connect = async (callback) => {
    try {
      await connectFromHook();

      if (!!callback) {
        await callback();
      }

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  const disconnect = async () => {
    try {
      await destroy();

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  return {
    address,
    connect,
    disconnect,
    wrongNetwork
  };
};