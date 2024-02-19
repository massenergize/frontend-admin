import React, { useEffect, useState } from "react";


export default function EventNotificationSettings({ name }) {
  const [state, setState] = useState({
    email: false,
    push: false,
    sms: false,
  });

  useEffect(() => {
    // fetch the data from the server
  }, []);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <p> Settings for "<b>{name}</b>" </p>
    </div>
  );
}
