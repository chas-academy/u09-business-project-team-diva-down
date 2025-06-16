import { Route, Routes } from "react-router";
import { RouterContainer } from "./RouteContainer";
import Homepage from "../pages/Homepage";
import Gameloop from "../pages/Gameloop";
import SingePlayerGameLoop from "../pages/SinglePlayerGameLoop";
import UserDashboard from "../pages/UserDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Leaderboard from "../pages/Leaderboard";
import CustomTrivia from "../pages/CustomTrivia";
import CustomMultiplayer from "../pages/CustomMultiplayer";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Gameloop} element={<Gameloop />} />
            <Route path={RouterContainer.SinglePlayer} element={<SingePlayerGameLoop />} />
            <Route path={RouterContainer.UserDashboard} element={<UserDashboard />} />
            <Route path={RouterContainer.Login} element={<Login />} />
            <Route path={RouterContainer.Register} element={<Register />} />
            <Route path={RouterContainer.Leaderboard} element={<Leaderboard />} />
            <Route path={RouterContainer.CustomTrivia} element={<CustomTrivia />} />
            <Route path={RouterContainer.CustomMultiplayer} element={<CustomMultiplayer />} />
        </Routes>
    );
};

export default AppRoutes;