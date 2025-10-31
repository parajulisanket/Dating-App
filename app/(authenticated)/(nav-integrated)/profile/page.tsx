
import { Header } from "@/components/MyProfile/Header";
import { MyInfo } from "@/components/MyProfile/MyInfo";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1   ">
        <MyInfo  />
      </main>
    </div>
  );
}
