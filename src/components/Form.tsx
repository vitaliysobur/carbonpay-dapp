import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Form = ({ children }: Props) => {
  return (
    <form className="relative max-w-[420px] w-full mt-12 p-5 pt-12 bg-white bg-opacity-30 rounded-xl text-white">
      {children}
    </form>
  );
};

export default Form;
