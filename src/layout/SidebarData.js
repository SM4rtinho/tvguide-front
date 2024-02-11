import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { TbSettings } from "react-icons/tb";
import { BsCameraVideo } from "react-icons/bs";

export const SidebarData = [
  {
    title: "Program TV",
    path: "/",
    cName: "nav-text",
    // icon: <BsCameraVideo />,
  },
  {
    title: "Mój Program TV",
    path: "/my",
    cName: "nav-text",
  },
  {
    title: "Wyszukaj",
    path: "/search",
    cName: "nav-text",
  },
  {
    title: "Lista do obejrzenia",
    path: "/watch-list",
    cName: "nav-text",
  },
  {
    title: "Rekomendacje",
    path: "/recommendations",
    cName: "nav-text",
  },
  {
    title: "Moje kanały",
    path: "/my-channels",
    cName: "nav-text",
  },
  {
    title: " Edycja profilu",
    path: "/edit-profile",
    icon: <TbSettings />,
    cName: "nav-text",
  },
  {
    title: " Wyloguj",
    path: "/logout",
    icon: <IoIcons.IoMdLogOut />,
    cName: "nav-text",
  },
];
