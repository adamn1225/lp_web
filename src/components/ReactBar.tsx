import React, { useState, useEffect } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/global.scss';

const ReactBar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY >= 60);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div
            id="HeaderWrapper"
            role="navigation"
            aria-label="main navigation"
            className={`absolute top-0 start-0 w-full z-50 bg-white border-slate-100 ${scrolled ? 'bg-white border-b border-muted-200 shadow-muted-300/30' : 'lg:bg-transparent'}`}
        >
            <header
                id="MainHeader"
                className="min-h-[70px] w-full max-w-full px-3 flex justify-between items-center shadow lg:shadow-md lg:px-8"
            >
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex gap-4 py-2">
                        <img
                            src="/images/lp-final-top.png"
                            alt="logo"
                            className="xs:w-full xs:h-8 md:w-64"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button id="MenuToggle" onClick={toggleMobileMenu}>
                        {mobileOpen ? <X id="CloseIcon" name="lucide:x" /> : <LayoutGrid id="OpenIcon" name="lucide:menu" />}
                    </button>
                </div>
            </header>
            <nav
                aria-label="Main Navigation"
                className={`absolute top-full z-50 right-0 bg-white lg:bg-transparent lg:static px-3 lg:px-0 ${mobileOpen ? 'block pt-5 pb-8 lg:p-0 right-0 -translate-y-px border-b border-muted-200 dark:border-muted-800 dark:bg-muted-950 shadow-lg shadow-muted-300/30 dark:shadow-muted-800/20' : 'hidden'}`}
            >
                <ul
                    id="LeftLinks"
                    className="flex flex-col lg:flex-col justify-center items-center [&>li>a]:h-full"
                >
                    {/* Add your navigation links here */}
                </ul>

                <ul
                    id="RightLinks"
                    className="flex flex-col lg:flex-col justify-center items-stretch gap-3 [&>li>a]:h-full [&>li>a]:grid [&>li>a]:place-items-center"
                >
                    <li>
                        <Link
                            to="/about"
                            className="hover:text-slate-900 py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <span className="text-lg text-slate-900 hover:text-secondary">About</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/linelanding"
                            className="py-2 px-3 group text-base transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <span className="text-lg text-text-slate-900 hover:text-secondary">Our Services</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/property-management"
                            className="hover:text-secondary py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <span className="text-lg text-text-slate-900 hover:text-secondary">Property Management</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/properties"
                            className="py-2 px-3 group text-base text-muted-500 transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <span className="text-lg text-slate-900 hover:text-secondary">All Properties</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/contact"
                            className="hover:text-secondary py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <span className="text-lg text-text-slate-900 hover:text-secondary">Contact Us</span>
                        </Link>
                    </li>

                    <li>
                        <a
                            href="tel:1-800-888-8888"
                            className="hover:text-slate-900 py-2 px-3 leading-6 group text-base text-muted-500 dark:text-muted-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                        >
                            <button
                                className="bg-secondary w-full min-w-[120px] font-medium text-lg leading-6 px-3.5 py-1.5 flex justify-center items-center transition-all duration-300 shadow-md shadow-slate-500/30 rounded-3xl text-white"
                            >
                                1-800-888-8888
                            </button>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ReactBar;