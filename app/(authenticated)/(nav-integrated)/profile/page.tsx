import TopBar from "@/components/layout/TopBar";
import FooterNav from "@/components/layout/FooterBar";
import { Header } from "@/components/MyProfile/Header"
import { MyInfo } from "@/components/MyProfile/MyInfo";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed bg-white w-[393px] z-50">
        <Header />
      </div>

      <main className="flex-1 pb-20 pt-[50px]  ">
        <MyInfo />
      </main>




    </div>
  );
}
