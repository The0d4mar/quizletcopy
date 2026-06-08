
import DeckList from "@/components/ui/MainDeckList/DeckList";
import AddDeckBtn from "@/components/ui/AddDeckBtn/AddDeckBtn";

export default function Home() {


  return (
    <section className="custom-main-section">
      <div className="flex mb-[var(--margin-b-elems)]">
        <AddDeckBtn/>
      </div>
      <DeckList/>
    </section>
  );
}