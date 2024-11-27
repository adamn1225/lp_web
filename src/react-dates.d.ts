declare module 'react-dates' {
    import { Component } from 'react';

    export interface DateRangePickerProps {
        startDate: any;
        startDateId: string;
        endDate: any;
        endDateId: string;
        onDatesChange: (arg: { startDate: any; endDate: any }) => void;
        focusedInput: any;
        onFocusChange: (focusedInput: any) => void;
        numberOfMonths?: number;
        showClearDates?: boolean;
        reopenPickerOnClearDates?: boolean;
        isOutsideRange?: (day: any) => boolean;
    }

    export class DateRangePicker extends Component<DateRangePickerProps> { }

    export const FocusedInputShape: any;
}