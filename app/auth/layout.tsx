import Image from "next/image";
import imageUrl from "@/public/images/brand-image.webp";

const MainTemplate = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="flex">
      <div
        className="-z-50 w-full hidden lg:flex"
        style={{
          position: "relative",
        }}
      >
        <Image
          src={imageUrl}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {children}
    </section>
  );
};

export default MainTemplate;
