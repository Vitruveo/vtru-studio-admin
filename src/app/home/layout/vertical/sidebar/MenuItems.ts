import { uniqueId } from 'lodash';

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
}
import { IconPackage, IconChartDonut3, IconAperture, IconList } from '@tabler/icons-react';

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
        title: 'Allow List',
        icon: IconList,
        href: '/home/allowList',
    },
    {
        id: uniqueId(),
        title: 'Waiting List',
        icon: IconList,
        href: '/home/waitingList',
    },
    {
        id: uniqueId(),
        title: 'Users',
        icon: IconPackage,
        href: '/home/contents/users',
    },

    {
        id: uniqueId(),
        title: 'Creators',
        icon: IconChartDonut3,
        href: '/home/contents/creators',
    },
    {
        id: uniqueId(),
        title: 'Assets',
        icon: IconChartDonut3,
        href: '/home/contents/assets',
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
    },
];

export default Menuitems;
