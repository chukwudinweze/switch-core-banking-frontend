import { ReactNode } from "react";

const AuthFormWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mb-3 mt-6 border-2 border-[#3E4B830A] rounded-xl py-10 px-8 md:px-12">
      {children}
    </div>
  );
};

export default AuthFormWrapper;
