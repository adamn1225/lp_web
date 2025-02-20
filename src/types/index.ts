// This file exports any necessary TypeScript types or interfaces that may be used throughout the application, ensuring type safety for props and state management.

export interface CalendarComponentProps {
    state: any[];
    setState: (state: any[]) => void;
    disabledDates: Date[];
    datePrices: { [key: string]: number };
}