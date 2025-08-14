import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p>From</p>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          placeholderText="dd/mm/yy"
          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>
      <div>
        <p>To</p>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          placeholderText="dd/mm/yy"
          minDate={startDate || undefined}
          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-0 placeholder-gray-400"
        />
      </div>
    </div>
  );
};
