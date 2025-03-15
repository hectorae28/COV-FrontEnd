import AppBar from "./AppBar";
import Presents from "./Presents";
import Section from "./section";

export default function Home() {
  return (
    <div className="bg-[#F9F9F9]">
      <header>
        <AppBar />
      </header>
      <main>
        <Presents />
        <Section />
      </main>
    </div>
  );
}
