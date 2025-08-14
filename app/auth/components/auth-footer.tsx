import { AFFLogo } from "@/components/logos";

import React from "react";

const AuthFooter = () => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <div>
        <p className="text-xs text-primaryBlack font-semibold">Powered by </p>
      </div>
      <AFFLogo height={16} width={16} />
    </div>
  );
};

export default AuthFooter;
