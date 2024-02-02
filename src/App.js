import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";

import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/login/Register";
import EventHandler from "bootstrap/js/src/dom/event-handler";
import { axiosConfig, setupAxios } from "./api/setupAxios";
import GuestOutlet from "./router/GuestRouting";
import AdminOutlet from "./router/AdminRouting";
import UserOutlet from "./router/UserRouting";
import TvProgram from "./pages/home/TvProgram";
import WatchList from "./pages/watchlist/WatchList";
import Logout from "./pages/logout/Logout";
import Recommendations from "./pages/recommendations/Recommandations";
import Notifications from "./pages/notifications/Notifications";

const queryClient = new QueryClient();

function App() {
  const { me, user } = useAuth();
  console.log(user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setupAxios(token);
    if (token) {
      me(token);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/*<Navbar />*/}
        <Routes>
          <Route path="/" element={<UserOutlet />}>
            <Route path="/" element={<TvProgram />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/watch-list" element={<WatchList />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          <Route path="/" element={<AdminOutlet />}>
            <Route path="/" element={<TvProgram />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/" element={<GuestOutlet />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}
export default App;
