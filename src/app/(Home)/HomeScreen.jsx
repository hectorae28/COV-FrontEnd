import AppBar from "./AppBar";
import Barra from "./Barra";
import Cards from "./Cards";
import Carnet from "./Carnet";
import Tabla from "./Tabla";

export default function Home() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen flex">
      {/* Fixed sidebar */}
      <aside className="w-72 bg-gradient-to-t from-[#D7008A] to-[#41023B] text-white fixed h-screen overflow-y-auto z-51">
        <AppBar />
      </aside>

      {/* Main content with padding to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-h-screen ml-72">
        {/* Fixed top bar */}
        <Barra />
        
        {/* Scrollable main content with padding to account for fixed top bar */}
        <main className="flex-1 overflow-y-auto pt-26 px-34">
          <div className="row flex space-x-14">
            <Cards />
            <Carnet />
          </div>
          <Tabla />
        </main>
      </div>
    </div>
  );
}