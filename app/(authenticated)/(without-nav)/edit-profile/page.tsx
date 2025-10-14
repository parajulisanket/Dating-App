import FooterNav from "@/components/layout/FooterBar";
import { MyInfo } from "@/components/MyProfile/MyInfo";
import { EditProfile } from "@/components/EditProfile/EditProfile";
export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">


            <main className="flex-1  ">
                <EditProfile />
            </main>




        </div>
    );
}
