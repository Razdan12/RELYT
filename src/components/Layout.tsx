
import NavbarAdmin from "./Dashboard/Navbar";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 z-50">
        <NavbarAdmin />
      </div>

      

      <main className="container mx-auto px-6 py-8 space-y-8">
        <>
          <Outlet />
        </>
      </main>
    </div>
  );
};

export default LayoutAdmin;
