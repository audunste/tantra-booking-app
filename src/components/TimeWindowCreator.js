// src/components/TimeWindowCreator.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

// Utility function to generate duration options
const generateDurationOptions = () => {
  const options = [];
  for (let minutes = 15; minutes <= 240; minutes += 15) { // Up to 4 hours
    options.push({ value: minutes, label: `${minutes} minutes` });
  }
  return options;
};

const TimeWindowCreator = ({ onCreate }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(null);

  const durationOptions = generateDurationOptions();

  const handleSubmit = () => {
    if (startTime && duration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration.value);

      onCreate({
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
    } else {
      alert('Please select both start time and duration.');
    }
  };

  return (
    <div>
      <h2>Create Time Window</h2>
      <div>
        <label>Date:</label>
        <DatePicker
          selected={date}
          onChange={setDate}
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
        />
      </div>
      <div>
        <label>Start Time:</label>
        <TimePicker
          onChange={setStartTime}
          value={startTime}
          disableClock={true}
          format="HH:mm"
          clearIcon={null}  // Optional: remove the clear button
        />
      </div>
      <div>
        <label>Duration:</label>
        <Select
          options={durationOptions}
          value={duration}
          onChange={setDuration}
          placeholder="Select duration"
        />
      </div>
      <button onClick={handleSubmit}>Create Time Window</button>
    </div>
  );
};

export default TimeWindowCreator;
