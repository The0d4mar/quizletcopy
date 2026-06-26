
import DeckList from "@/components/ui/MainDeckList/DeckList";
import AddDeckBtn from "@/components/ui/AddDeckBtn/AddDeckBtn";

const Home = () => {


  return (
    <section className="mainSection">
      <div className="flex mb-[var(--marginButtom)]">
        <AddDeckBtn/>
      </div>
      <DeckList/>
    </section>
  );
};

export default Home;
