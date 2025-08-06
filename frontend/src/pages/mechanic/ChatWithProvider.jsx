// File: src/pages/mechanic/ChatWithProvider.jsx
import React from "react";
import ChatLayout from "../../components/common/Chat/ChatLayout";

export default function ChatWithProvider() {
  const mockProviders = [
    {
      id: "prov1",
      name: "Ashok Garage",
      avatar: "/avatars/provider1.jpg",
      lastMessage: "Received. Great work!",
      lastTime: "2:15 PM",
      mockMessages: [
        {
          sender: "self",
          content: "Sir, alignment job completed.",
          time: "2:00 PM",
          status: "delivered",
        },
        {
          sender: "other",
          content: "Received. Great work!",
          time: "2:03 PM",
        },
      ],
    },
    {
      id: "prov2",
      name: "GoMechanic Delhi",
      avatar: "/avatars/provider2.jpg",
      lastMessage: "Invoice has been shared.",
      lastTime: "1:30 PM",
      mockMessages: [
        {
          sender: "other",
          content: "Did you upload today’s invoice?",
          time: "1:00 PM",
        },
        {
          sender: "self",
          content: "Yes, just shared it now.",
          time: "1:25 PM",
          status: "sent",
        },
      ],
    },
  ];

  return (
    <ChatLayout userList={mockProviders} defaultTitle="Garage Providers" />
  );
}
