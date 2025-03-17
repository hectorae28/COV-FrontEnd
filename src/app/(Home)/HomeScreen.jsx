import AppBar from "./AppBar";
import Presents from "./Presents";
import Cards from "./Cards";
import Sponser from "./Sponser";
import Noticias from "./Noticias";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-[#F9F9F9]">
      <header>
        <AppBar />
      </header>
      <main>
        <Presents />
        <Cards />
        <Sponser />
        <Noticias />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}