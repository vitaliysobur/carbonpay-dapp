import Link from "next/link";
import { NETWORK_DOMAIN } from "@/constants/constants";

interface Props {
  hash: string;
}

const TransactionLink = ({ hash }: Props) => {
  return (
    <div>
      <Link href={`${NETWORK_DOMAIN}/tx/${hash}/token-transfers`}>
        Payment receipt
      </Link>
    </div>
  );
};

export default TransactionLink;
