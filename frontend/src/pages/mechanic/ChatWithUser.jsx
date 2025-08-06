// File: src/pages/mechanic/ChatWithUser.jsx
import React from "react";
import ChatLayout from "../../components/common/Chat/ChatLayout";

export default function ChatWithUser() {
  const mockUsers = [
    {
      id: "cust1",
      name: "Rohit Sharma",
      avatar: "/avatars/user1.jpg",
      lastMessage: "Thanks! Will wait near the car.",
      lastTime: "10:47 AM",
      mockMessages: [
        {
          sender: "other",
          content: "Hi! My car broke down at Huda City Center.",
          time: "10:45 AM",
        },
        {
          sender: "self",
          content: "I'm on the way!",
          time: "10:46 AM",
          status: "read",
        },
      ],
    },
    {
      id: "cust2",
      name: "Priya Khanna",
      avatar: "/avatars/user2.jpg",
      lastMessage: "Please check brake pads too.",
      lastTime: "9:15 AM",
      mockMessages: [
        {
          sender: "other",
          content: "Can you service my Alto tomorrow?",
          time: "9:10 AM",
        },
        {
          sender: "self",
          content: "Yes, booked for 10 AM.",
          time: "9:12 AM",
          status: "delivered",
        },
      ],
    },
  ];

  return <ChatLayout userList={mockUsers} defaultTitle="Customers" />;
}
