import {Navigate, Outlet} from "react-router";
import Navbar from "../layout/Navbar";
import {useAuth} from "../context/AuthContext";

function AdminOutlet() {
    const {user} = useAuth();
    return user?.authorities[0].authority === "ADMIN" ? (<><Navbar/> <Outlet/></>) : <Navigate to="/login"/>;
}

export default AdminOutlet;