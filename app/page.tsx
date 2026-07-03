import AddDeckBtn from "@/components/ui/AddDeckBtn/AddDeckBtn";
import DeckList from "@/components/ui/MainDeckList/DeckList";

const labels = {
  title: "\u0412\u0430\u0448\u0430 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430",
  subtitle: "\u041a\u043e\u043b\u043e\u0434\u044b, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0432\u044b \u0441\u043e\u0437\u0434\u0430\u043b\u0438 \u0438\u043b\u0438 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043b\u0438 \u0434\u043b\u044f \u0443\u0447\u0451\u0431\u044b.",
};

const Home = () => {
  return (
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>
        <div className="pageHeaderActions">
          <AddDeckBtn />
        </div>
      </header>

      <DeckList />
    </section>
  );
};

export default Home;