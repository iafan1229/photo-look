import React, { useState } from "react";
import axios from "axios";

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [response, setResponse] = useState("");

  const handleChange = (e: any) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/send-email", emailData);
      setResponse(res.data);
    } catch (error) {
      setResponse("Failed to send email.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Emailing Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>To:</label>
          <input
            type='email'
            name='to'
            value={emailData.to}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type='text'
            name='subject'
            value={emailData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            name='message'
            value={emailData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit'>Send Email</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default EmailForm;
