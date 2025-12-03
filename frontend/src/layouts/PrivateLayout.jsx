import Navbar from "../components/navbar";
import BottomBar from "../components/barrainferior";
import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 pb-24">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
