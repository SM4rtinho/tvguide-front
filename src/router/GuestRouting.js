import {Navigate, Outlet} from "react-router";

function GuestOutlet() {
    const token = localStorage.getItem("token");
    return !token ? <Outlet/> : <Navigate to="/"/>;
}

export default GuestOutlet;