import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";

const links = [
  {
    label: "Pay",
    href: "/",
  },
  {
    label: "Register Merchant",
    href: "/register",
    validate: (isRegistered: boolean) => !isRegistered,
  },
];

export default function Tabs() {
  const router = useRouter();
  const { isRegistered } = useContext(WalletContext);

  return (
    <ul className="flex p-4 -mb-1 w-full max-w-[420px] text-2xl font-bold justify-center">
      {links.map((link) => {
        if (link.validate && !link.validate(isRegistered)) {
          return null;
        }

        const isActive = router.pathname == link.href;

        return (
          <li
            key={link.label}
            className={`p-2  ${isActive ? "text-white" : "text-neutral-400"}`}
          >
            <Link href={link.href}>
              <a>{link.label}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
