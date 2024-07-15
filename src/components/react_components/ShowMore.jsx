import React, { useState } from 'react';
import More from './More';
import ListingSetTwo from './ListingSetTwo';

function ShowMore() {
    const [showMain, setShowMain] = useState(false);

    const handleClick = () => {
        setShowMain(true);
    };

    return (
        <div>
            <More handleClick={handleClick} />
            {showMain && <ListingSetTwo />}
        </div>
    );
}

export default ShowMore;
