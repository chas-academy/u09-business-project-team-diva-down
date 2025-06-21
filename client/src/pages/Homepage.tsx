import Footer from "../components/common/footer";
import Header from "../components/common/header";
import Leaderboard from "../components/hoc/loc/leaderboard_card";
import PlayerStats from "../components/hoc/loc/playerstats_card";
import News from "../components/hoc/loc/news_card";
import SinglePlayer_button from "../components/hoc/loc/SinglePlayer_button";
import MultiPlayer_button from "../components/hoc/loc/MultiPlayer_button";
import Homepage_title_info from "../components/hoc/loc/homepage_title_info";

const Homepage = () => {

    return (
        <>
            <div id="container" className="Homepage">
                <Header />
                <main className="main">
                    <section className="title-section">
                        <Homepage_title_info />
                    </section>
                    <section className="homepage-button-container">
                        <SinglePlayer_button />
                        <MultiPlayer_button />
                    </section>
                    <section className="card-container">
                        <Leaderboard />
                        <PlayerStats />
                        <News />
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Homepage;