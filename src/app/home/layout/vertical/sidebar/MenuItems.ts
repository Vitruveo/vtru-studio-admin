import { uniqueId } from 'lodash';
import packageJSON from '@/../package.json';

interface MenuitemsType {
    [x: string]: any;
    id?: string;
    navlabel?: boolean;
    subheader?: string;
    title?: string;
    icon?: any;
    href?: string;
    children?: MenuitemsType[];
    chip?: string;
    chipColor?: string;
    variant?: string;
    external?: boolean;
    permission?: string;
}
import {
    IconPackage,
    IconChartDonut3,
    IconAperture,
    IconClock,
    IconCheck,
    IconHandOff,
    IconLoader2,
    IconX,
    IconBan,
} from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
    {
        navlabel: true,
        subheader: 'Home',
    },

    {
        id: uniqueId(),
        title: 'General',
        icon: IconAperture,
        href: '/home',
    },
    {
        navlabel: true,
        subheader: 'Applications',
    },
    {
        id: uniqueId(),
        title: 'Moderation',
        icon: IconAperture,
        permission: 'moderator',
        children: [
            {
                id: uniqueId(),
                title: 'Pending',
                icon: IconClock,
                href: '/home/moderation/pending',
            },
            {
                id: uniqueId(),
                title: 'Approved',
                icon: IconCheck,
                href: '/home/moderation/approved',
            },
            {
                id: uniqueId(),
                title: 'Rejected',
                icon: IconHandOff,
                href: '/home/moderation/rejected',
            },
            {
                id: uniqueId(),
                title: 'Canceled',
                icon: IconBan,
                href: '/home/moderation/canceled',
            },
            {
                id: uniqueId(),
                title: 'Running',
                icon: IconLoader2,
                href: '/home/moderation/running',
            },
            {
                id: uniqueId(),
                title: 'Error',
                icon: IconX,
                href: '/home/moderation/error',
            },
        ],
    },
    // {
    //     id: uniqueId(),
    //     title: 'Allow List',
    //     icon: IconList,
    //     href: '/home/allowList',
    //     permission: 'allow-list',
    // },
    // {
    //     id: uniqueId(),
    //     title: 'Waiting List',
    //     icon: IconList,
    //     href: '/home/waitingList',
    //     permission: 'waiting-list',
    // },
    {
        id: uniqueId(),
        title: 'Users',
        icon: IconPackage,
        href: '/home/contents/users',
        permission: 'user',
    },

    {
        id: uniqueId(),
        title: 'Creators',
        icon: IconChartDonut3,
        href: '/home/contents/creators',
        permission: 'creator',
    },
    {
        id: uniqueId(),
        title: 'Assets',
        icon: IconChartDonut3,
        href: '/home/contents/assets',
        permission: 'asset',
    },
    {
        navlabel: true,
        subheader: 'Settings',
    },
    // {
    //   id: uniqueId(),
    //   title: "General",
    //   icon: IconChartDonut3,
    //   href: "/home/contents/general",
    // },
    {
        id: uniqueId(),
        title: 'Roles',
        icon: IconChartDonut3,
        href: '/home/contents/roles',
        permission: 'role',
    },
    {
        subheader: 'v' + packageJSON.version,
        navlabel: true,
    },
];

export default Menuitems;
