import React, { useState, useCallback } from "react";
import { Card, Avatar, Input, Button, Space } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;

/**
 * ShareCard
 *
 * Props:
 * - initialCaption: string (optional)
 * - onShare: (caption) => Promise|void   // if returns a Promise, component shows loading
 * - onCancel: () => void (optional)
 * - avatar: string (optional) overrides current user avatar
 * - username: string (optional) overrides current user name
 * - maxLength: number (optional, default 300)
 * - showAvatar: boolean (default true)
 */
const ShareCard = ({
  initialCaption = "",
  onShare,
  onCancel,
  avatar,
  username,
  maxLength = 500,
  showAvatar = true,
  className = "",
}) => {
  const currentUser = useSelector((state) => state.auth.user);
  const userAvatar =
    avatar ||
    currentUser?.profile?.avatar ||
    (currentUser?._id
      ? `https://i.pravatar.cc/150?u=${currentUser._id}`
      : null);
  const name = username || currentUser?.fullName || currentUser?.username || "";

  const [caption, setCaption] = useState(initialCaption);
  const [loading, setLoading] = useState(false);

  const handleShare = useCallback(async () => {
    const trimmed = (caption || "").trim();
    if (!trimmed) return;
    if (!onShare) return;

    try {
      const result = onShare(trimmed);
      if (result && typeof result.then === "function") {
        setLoading(true);
        await result;
        setLoading(false);
      }
    } catch (err) {
      // let parent handle errors; stop loading
      setLoading(false);
      // optionally rethrow or log
      // console.error("ShareCard.onShare error:", err);
    }
  }, [caption, onShare]);

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleShare();
    }
  };

  const handleCancel = () => {
    setCaption(initialCaption);
    if (onCancel) onCancel();
  };

  const shareDisabled = loading || !(caption || "").trim();

  return (
    <Card
      className={`!rounded-lg !shadow-sm !p-3 ${className}`}
      bodyStyle={{ padding: 12 }}
      hoverable
    >
      <div className="flex items-start gap-3">
        {showAvatar && (
          <Avatar
            size={48}
            src={userAvatar}
            className="flex-shrink-0"
            alt={name || "user"}
          >
            {!userAvatar && name ? name[0]?.toUpperCase() : null}
          </Avatar>
        )}

        <div className="flex-1 min-w-0">
          <TextArea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={maxLength}
            placeholder="Viết chú thích... (Ctrl/Cmd + Enter để chia sẻ)"
            showCount
            className="resize-none"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500 truncate">
              {name ? `Chia sẻ bằng ${name}` : "Chia sẻ công khai"}
            </div>

            <Space>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleShare}
                loading={loading}
                disabled={shareDisabled}
              >
                Share
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ShareCard.propTypes = {
//   initialCaption: PropTypes.string,
//   onShare: PropTypes.func,
//   onCancel: PropTypes.func,
//   avatar: PropTypes.string,
//   username: PropTypes.string,
//   maxLength: PropTypes.number,
//   showAvatar: PropTypes.bool,
//   className: PropTypes.string,
// };

export default ShareCard;
