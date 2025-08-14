import Image from "next/image";

export const AppLogo = ({
  height = 16,
  width = 16,
}: {
  height: number;
  width: number;
}) => {
  return (
    <div>
      <Image
        alt="Logo"
        src="/images/interswitch_logo.svg"
        priority
        quality={100}
        width={height}
        height={width}
        className="-z-50"
      />
    </div>
  );
};

export const DashSecondaryLogo = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return (
    <div>
      <Image
        alt="Logo"
        src="/images/interswitch_logo.svg"
        priority
        quality={100}
        width={height}
        height={width}
        className="-z-50"
      />
    </div>
  );
};

export const AFFLogo = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return (
    <div>
      <Image
        alt="Aff logo"
        src="/images/interswitch_logo.svg"
        priority
        quality={100}
        width={width}
        height={height}
        className="-z-50"
      />
    </div>
  );
};

export const AccessBankLogo = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return (
    <div>
      <Image
        alt="accessbank logo"
        src="/images/accessbank-logo.svg"
        priority
        quality={100}
        width={width}
        height={height}
        className="-z-50"
      />
    </div>
  );
};
