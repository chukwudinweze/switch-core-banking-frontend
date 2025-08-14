import AppNavbar from "@/components/nav/app-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative">
      <AppNavbar />
      {/* updated the space top */}
      <div className="flex items-start pt-14 lg:pt-[50px]">
        <div className="bg-[#F9F9F9] border-[#D9D9D980] w-full min-h-screen px-5 lg:px-10 overflow-x-auto pb-6 pt-10">
          {children}
        </div>
      </div>
    </main>
  );
}
