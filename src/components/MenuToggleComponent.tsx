import React, { useState } from 'react';
import { Menu, X, LayoutGrid } from 'lucide-react';

interface MenuToggleComponentProps {
    onToggle: (isOpen: boolean) => void;
}

const MenuToggleComponent: React.FC<MenuToggleComponentProps> = ({ onToggle }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMenu = () => {
        const newState = !mobileOpen;
        setMobileOpen(newState);
        onToggle(newState);
    };

    return (
        <button id="MenuToggle" onClick={toggleMenu}>
            {mobileOpen ? <X /> : <LayoutGrid />}
        </button>
    );
};

export default MenuToggleComponent;