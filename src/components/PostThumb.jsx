import { HeartOutlined, MessageOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Modal } from "antd";
import PostDetailPage from "../pages/PostDetailPage";

export default function PostThumb({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative rounded-lg overflow-hidden group shadow-md aspect-square w-full">
        {/* Image */}
        <img
          src={post?.mediaFiles[0]?.url || "https://via.placeholder.com/300"}
          alt="post"
          className="w-full h-full object-cover"
        />

        {/* Hover overlay */}
        <div
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <p className="text-white text-lg font-semibold">View post</p>
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-1">
              <HeartOutlined />
              <span>{post?.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageOutlined />
              <span>{post?.comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="90vw"
        style={{ maxWidth: 1200 }}
        centered
        destroyOnHidden
      >
        <PostDetailPage
          postId={post._id}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
