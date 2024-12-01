import { useState, useEffect } from 'react';

const useLoadScript = (src: string) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        console.log(`Loading script: ${src}`);

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log(`Script loaded: ${src}`);
            setLoaded(true);
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            setError(true);
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [src]);

    if (error) {
        console.error(`Failed to load script: ${src}`);
    }

    return loaded;
};

export default useLoadScript;