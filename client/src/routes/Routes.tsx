import { Route, Routes } from "react-router";
import { RouterContainer } from "./RouteContainer";
import Homepage from "../pages/Homepage";
import Gameloop from "../pages/Gameloop";
import SingePlayerGameLoop from "../pages/SinglePlayerGameLoop";
import UserDashboard from "../pages/UserDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Gameloop} element={<Gameloop />} />
            <Route path={RouterContainer.SinglePlayer} element={<SingePlayerGameLoop />} />
            <Route path={RouterContainer.UserDashboard} element={<UserDashboard />} />
            <Route path={RouterContainer.Login} element={<Login />} />
            <Route path={RouterContainer.Register} element={<Register />} />
        </Routes>
    );
};

export default AppRoutes;