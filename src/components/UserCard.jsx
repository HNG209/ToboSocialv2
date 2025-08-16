import React from "react";
import { Card, Avatar } from "antd";

const UserCard = ({ avatar, username, fullname, onClick }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className="!rounded-xl !shadow-md !border-0 !p-0 !mb-2 transition-colors duration-200 group"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center gap-4 p-4 group-hover:bg-blue-50">
        <Avatar
          src={avatar || "/default-avatar.png"}
          size={56}
          className="flex-shrink-0"
        >
          {fullname?.[0]?.toUpperCase()}
        </Avatar>
        <div className="min-w-0">
          <div className="font-semibold text-lg text-gray-900 truncate">
            {fullname}
          </div>
          <div className="text-gray-500 text-sm truncate">@{username}</div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
