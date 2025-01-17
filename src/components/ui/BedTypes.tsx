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
        default:
            return null;
    }
};

const BedTypes: React.FC<BedTypesProps> = ({ beds }) => {
    const hasBeds = beds.some(room => room.beds.length > 0);

    return (
        <div className="my-4">
            {hasBeds && <h3 className="text-xl font-bold mb-2 text-center">Bed Types</h3>}
            <div className="flex flex-wrap gap-4">
                {beds.filter((room) => room.beds.length > 0).flatMap((room) => (
                    room.beds.map((bed, bedIndex) => (
                        <div key={bedIndex} className="flex items-center gap-2">
                            {getBedIcon(bed.type)}
                            <p className="text-md">
                                {bed.type.replace('_', ' ').toLowerCase()}
                            </p>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default BedTypes;