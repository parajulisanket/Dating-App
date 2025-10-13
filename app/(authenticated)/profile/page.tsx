import FooterBar from "@/components/layout/FooterBar";
import { MyInfo } from "@/components/MyProfile/MyInfo";
import Header from "@/components/MyProfile/Header";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      <Header />{" "}
      <main className="flex-1">
        {" "}
        <MyInfo />{" "}
      </main>{" "}
      <FooterBar />{" "}
    </div>
  );
}
