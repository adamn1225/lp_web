// src/components/ui/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    propertiesPerPage: number;
    totalProperties: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, propertiesPerPage, totalProperties, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProperties / propertiesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-8">
            <ul className="flex justify-center space-x-2">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-full`}>
                        <a onClick={() => paginate(number)} href="!#" className="page-link px-4 py-2 rounded-full">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;