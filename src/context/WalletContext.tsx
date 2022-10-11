import useWallet from "@/hooks/useWallet";
import { createContext, ReactNode } from "react";

type Context = ReturnType<typeof useWallet>;

export const WalletContext = createContext<Context>({} as Context);

interface Props {
  children: ReactNode;
}

export const WalletProvider = ({ children }: Props) => {
  const value = useWallet();

  return (
    <WalletContext.Provider value={value}>
      {value.isLoading ? null : children}
    </WalletContext.Provider>
  );
};
