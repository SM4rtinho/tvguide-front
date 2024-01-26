import {Navigate, Outlet} from "react-router";
import Navbar from "../layout/Navbar";

function UserOutlet() {
    const token = localStorage.getItem("token");
    return token ? (<><Navbar/> <Outlet/></>) : <Navigate to="/login"/>;
}

export default UserOutlet;