import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Friendslist_card from "../components/common/Friendslist";
import UserInfo from "../components/common/User_Info_Dashboard";

const UserDashboard = () => {

    return (
        <>
            <div className="userdashboard">
                <Header />
                    <main className="main">
                        <section className="sub_main">
                            
                            <UserInfo />

                            <Friendslist_card />

                        </section>
                    </main>
                <Footer />
            </div>
        </>
    );
};

export default UserDashboard;