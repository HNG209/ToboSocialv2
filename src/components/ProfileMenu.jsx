import { useState } from "react";
import {
  AppstoreOutlined,
  PlaySquareOutlined,
  NotificationOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { FiBookmark } from "react-icons/fi";
const items = [
  {
    label: "Posts",
    key: "posts",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Shared",
    key: "shared",
    icon: <SendOutlined />,
  },
  {
    label: "Saved",
    key: "saved",
    icon: <FiBookmark className="text-black hover:text-gray-400" />,
  },
  {
    label: "Tags",
    key: "tags",
    icon: <NotificationOutlined />,
  },
];
const ProfileMenu = ({ current, setCurrent }) => {
  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      style={{ backgroundColor: "#f9fafb", color: "#fff" }}
      className="flex items-center justify-center"
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
export default ProfileMenu;
