import { Route, Routes } from "react-router";
import { RouterContainer } from "./RouteContainer";
import Homepage from "../pages/Homepage";
import Gameloop from "../pages/Gameloop";
import SingePlayerGameLoop from "../pages/SinglePlayerGameLoop";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Gameloop} element={<Gameloop />} />
            <Route path={RouterContainer.SinglePlayer} element={<SingePlayerGameLoop />} />
        </Routes>
    );
};

export default AppRoutes;