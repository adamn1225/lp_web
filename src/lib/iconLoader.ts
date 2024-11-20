// src/lib/iconLoader.ts
import * as pi from "react-icons/pi";
import * as md from "react-icons/md";
import * as io5 from "react-icons/io5";
import * as tb from "react-icons/tb";
import * as fa from "react-icons/fa";
import * as gi from "react-icons/gi";
import * as vsc from "react-icons/vsc";
import * as lia from "react-icons/lia";
import * as ai from "react-icons/ai";
import * as bi from "react-icons/bi";
import * as lu from "react-icons/lu";
import * as ci from "react-icons/ci";
import * as gr from "react-icons/gr";
import * as bs from "react-icons/bs";
import * as ri from "react-icons/ri";
import * as fa6 from "react-icons/fa6";
import * as cg from "react-icons/cg";

const libraries = { pi, md, io5, tb, fa, gi, vsc, lia, ai, bi, lu, ci, gr, bs, ri, fa6, cg }

export const loadIcon = (iconName: string) => {
    if (!iconName) {
        console.error("Icon name is undefined");
        return null;
    }

    const match = iconName.match(/([a-z]+)\.([A-Za-z0-9]+)/);
    if (!match) {
        console.error(`Icon name does not match the expected pattern: ${iconName}`);
        return null;
    }

    const [, library, icon] = match;
    const IconComponent = libraries[library]?.[icon];
    if (!IconComponent) {
        console.error(`Icon not found in library: ${library}.${icon}`);
    }
    return IconComponent;
};