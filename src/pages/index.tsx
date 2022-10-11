import s from "@/styles/App.module.css";
import PaymentForm from "@/components/PaymentForm";
import Layout from "@/components/Layout";
import Tabs from "../components/Tabs";

export default function Index() {
  return (
    <Layout>
      <div className={s.content}>
        <Tabs />
        <PaymentForm />
      </div>
    </Layout>
  );
}
