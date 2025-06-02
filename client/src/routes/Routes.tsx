import { Route, Routes } from "react-router";
import { RouterContainer } from "./RouteContainer";
import Homepage from "../pages/Homepage";
import Gameloop from "../pages/Gameloop";
import SingePlayerGameLoop from "../pages/SinglePlayerGameLoop";
import UserDashboard from "../pages/UserDashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Gameloop} element={<Gameloop />} />
            <Route path={RouterContainer.SinglePlayer} element={<SingePlayerGameLoop />} />
            <Route path={RouterContainer.UserDashboard} element={<UserDashboard />} />
        </Routes>
    );
};

export default AppRoutes;