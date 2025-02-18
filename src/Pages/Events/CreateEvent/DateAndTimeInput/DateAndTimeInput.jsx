import React from "react";

const DateAndTimeInput = ({ date, onDateChange, startTime, onStartTimeChange, endTime, onEndTimeChange, dateError, startTimeError, endTimeError }) => {
  return (
    <div className="space-y-4">
      <input
        type="date"
        className="input input-bordered w-full bg-base-100"
        value={date}
        onChange={onDateChange}
        required
      />
      {dateError && <p className="text-error text-sm">{dateError}</p>}
      <div className="flex gap-4">
        <input
          type="time"
          className="input input-bordered w-full bg-base-100"
          placeholder="Start Time"
          value={startTime}
          onChange={onStartTimeChange}
          required
        />
        {startTimeError && <p className="text-error text-sm">{startTimeError}</p>}
        <input
          type="time"
          className="input input-bordered w-full bg-base-100"
          placeholder="End Time"
          value={endTime}
          onChange={onEndTimeChange}
          required
        />
        {endTimeError && <p className="text-error text-sm">{endTimeError}</p>}
      </div>
    </div>
  );
};

export default DateAndTimeInput;