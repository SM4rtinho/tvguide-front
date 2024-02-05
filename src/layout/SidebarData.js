import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "TV Program",
    path: "/",
    cName: "nav-text",
  },
  {
    title: "My TV Program",
    path: "/my",
    cName: "nav-text",
  },
  {
    title: "Search",
    path: "/search",
    cName: "nav-text",
  },
  {
    title: "Watch list",
    path: "/watch-list",
    cName: "nav-text",
  },
  {
    title: "Recommendations",
    path: "/recommendations",
    cName: "nav-text",
  },
  {
    title: "My channels",
    path: "/my-channels",
    cName: "nav-text",
  },
  {
    title: "Log out",
    path: "/logout",
    icon: <IoIcons.IoMdLogOut />,
    cName: "nav-text",
  },
];
