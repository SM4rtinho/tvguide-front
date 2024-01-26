import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: 'TV Program',
        path: '/',
        cName: 'nav-text'
    },
    {
        title: 'Watch list',
        path: '/watch-list',
        cName: 'nav-text'
    },
    {
        title: 'Recommendations',
        path: '/recommendations',
        cName: 'nav-text'
    },
    {
        title: 'Favorites',
        path: '/favorites',
        cName: 'nav-text'
    },
    {
        title: 'Log out',
        path: '/logout',
        icon: <IoIcons.IoMdLogOut />,
        cName: 'nav-text'
    },
];