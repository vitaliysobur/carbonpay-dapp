import s from "@/styles/App.module.css";
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
    validate: (isRegistered: boolean) => true || !isRegistered,
  },
];

export default function Tabs() {
  const router = useRouter();
  const { isRegistered } = useContext(WalletContext);

  return (
    <ul className={s.nav}>
      {links.map((link) => {
        if (link.validate && !link.validate(isRegistered)) {
          return null;
        }

        return (
          <li
            key={link.label}
            className={`${s.navItem} ${
              router.pathname == link.href ? s.navItemSelected : ""
            }`}
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
