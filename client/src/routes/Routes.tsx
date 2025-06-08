import { Route, Routes } from "react-router";
import { RouterContainer } from "./RouteContainer";
import Homepage from "../pages/Homepage";
import Gameloop from "../pages/Gameloop";
<<<<<<< HEAD
import Chat from "../pages/Chat";
=======
import SingePlayerGameLoop from "../pages/SinglePlayerGameLoop";
import UserDashboard from "../pages/UserDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Leaderboard from "../pages/Leaderboard";
>>>>>>> main

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Gameloop} element={<Gameloop />} />
<<<<<<< HEAD
            <Route path={RouterContainer.Chat} element={<Chat />} />
=======
            <Route path={RouterContainer.SinglePlayer} element={<SingePlayerGameLoop />} />
            <Route path={RouterContainer.UserDashboard} element={<UserDashboard />} />
            <Route path={RouterContainer.Login} element={<Login />} />
            <Route path={RouterContainer.Register} element={<Register />} />
            <Route path={RouterContainer.Leaderboard} element={<Leaderboard />} />
>>>>>>> main
        </Routes>
    );
};

export default AppRoutes;