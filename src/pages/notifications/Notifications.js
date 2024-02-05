import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const Notifications = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEventSource(`http://localhost:8081/notifications/subscribe`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
          }
        },
      });
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
