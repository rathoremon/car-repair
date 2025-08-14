// src/pages/provider/MechanicChatPanel.jsx
import React from "react";
import ChatLayout from "../../components/common/Chat/ChatLayout";

export default function MechanicChatPanel() {
  const mockMechanics = [
    {
      id: "mech1",
      name: "Sahil Malik",
      avatar: "/avatars/mechanic1.jpg",
      lastMessage: "Finished alignment task.",
      lastTime: "4:20 PM",
      mockMessages: [
        {
          sender: "self",
          content: "Please send final report photos.",
          time: "4:15 PM",
          status: "sent",
        },
        {
          sender: "other",
          content: "Just shared in the job card.",
          time: "4:18 PM",
        },
      ],
    },
    {
      id: "mech2",
      name: "Neha Jaiswal",
      avatar: "/avatars/mechanic2.jpg",
      lastMessage: "Break inspection done.",
      lastTime: "3:50 PM",
      mockMessages: [
        {
          sender: "other",
          content: "Inspection done. Uploaded report.",
          time: "3:48 PM",
        },
      ],
    },
  ];

  return <ChatLayout userList={mockMechanics} defaultTitle="Mechanics" />;
}
