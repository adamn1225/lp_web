import React from 'react';
import { BedDouble, BedDoubleIcon } from 'lucide-react';
import { MdOutlineKingBed } from 'react-icons/md';
import { IoBedOutline } from 'react-icons/io5';

interface Bed {
    type: string;
    quantity: number;
}

interface Room {
    beds: Bed[];
}

interface BedTypesProps {
    beds: Room[];
}

const getBedIcon = (type: string) => {
    switch (type) {
        case 'SINGLE_BED':
            return <IoBedOutline className="w-5 h-5" />;
        case 'SOFA_BED':
            return <BedDoubleIcon className="w-5 h-5" />;
        case 'DOUBLE_BED':
            return <BedDouble className="w-5 h-5" />;
        case 'QUEEN_BED':
            return <MdOutlineKingBed className="w-5 h-5" />;
        case 'KING_BED':
            return <BedDouble className="w-5 h-5" />;
        case 'CRIB':
            return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M38 6V44" />
                    <path d="M10 40H38" />
                    <path d="M10 34H38" />
                    <path d="M6 12H42" />
                    <path d="M35 6L41 6" />
                    <path d="M7 6L13 6" />
                    <path d="M10 6V44" />
                    <path d="M17 12V28" />
                    <path d="M24 12V28" />
                    <path d="M31 12V28" />
                </g>
            </svg>
        case 'BUNK_BED':
            return <IoBedOutline className="w-5 h-5" />;
        default:
            return null;
    }
};

const BedTypes: React.FC<BedTypesProps> = ({ beds }) => {
    const filteredBeds = beds.filter((room) => room.beds.length > 0).flatMap((room) => room.beds);
    const hasBeds = filteredBeds.length > 0;

    return (
        <div className="my-4">
            {hasBeds && <h3 className="text-xl font-bold mb-2 text-center">Bed Types</h3>}
            <div className={`flex ${filteredBeds.length > 2 ? 'md:grid grid-cols-3' : 'flex'} justify-items-center place-items-center gap-x-2 gap-y-3`}>
                {filteredBeds.map((bed, bedIndex) => (
                    <div key={bedIndex} className="flex justify-center items-center gap-2">
                        {getBedIcon(bed.type)}
                        <p className="text-md">
                            {bed.type.replace('_', ' ').toLowerCase()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BedTypes;