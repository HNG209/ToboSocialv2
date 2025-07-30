import {
  Avatar,
  Modal,
  Button,
  Input,
  Menu,
  Dropdown,
  notification,
  Select,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  SoundOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../../styles/home.css";
import { useDispatch, useSelector } from "react-redux";
import { IoIosMore } from "react-icons/io";
import ProfileCard from "./ProfileCard ";
import PostDetailPage from "../pages/PostDetailPage";
import useProfileNavigate from "../hooks/useProfileNavigate";
import { toggleLike } from "../redux/post.slice";

// Hàm tính thời gian
const timeAgo = (date, referenceTime) => {
  const now = referenceTime || new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

// Hàm sao chép liên kết vào clipboard
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      notification.success({
        message: "Link Copied",
        description: "The post link has been copied to your clipboard.",
        placement: "topRight",
      });
    })
    .catch((error) => {
      console.error("Failed to copy:", error);
      notification.error({
        message: "Copy Failed",
        description: "Failed to copy the link. Please try again.",
        placement: "topRight",
      });
    });
};

function PostCard({ post: initialPost, userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateProfile = useProfileNavigate();
  const posts = useSelector((state) => state.feed.posts); // test only
  const status = "success";
  // const status = useSelector((state) => state.posts.status);
  const post = posts.find((p) => p._id === initialPost._id) || initialPost;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [postTime, setPostTime] = useState("");
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const videoRefs = useRef([]);
  const commentVideoRefs = useRef([]);
  const loadTime = useRef(new Date());
  const [showProfileCard, setShowProfileCard] = useState(false);
  const profileCardTimeoutRef = useRef(null);
  const [authorState, setAuthorState] = useState(post.author);

  const showPostDetailModal = () => {
    setIsPostDetailOpen(true);
  };

  const showShareModal = () => {
    setIsShareModalVisible(true);
  };

  const handleShareModalCancel = () => {
    setIsShareModalVisible(false);
  };

  const showReportModal = () => {
    setIsModalOpen(false);
    setIsReportModalOpen(true);
  };

  const showLoginNotification = () => {
    notification.warning({
      message: "Authentication Required",
      description:
        "Please log in to interact with posts, or continue viewing without interaction.",
      placement: "topRight",
      duration: 0,
      btn: (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              notification.destroy();
              navigate("/login");
            }}
          >
            Log In
          </Button>
          <Button onClick={() => notification.destroy()}>
            Continue Viewing
          </Button>
        </div>
      ),
    });
  };

  const handleReportModalOk = async () => {
    if (!userId) {
      showLoginNotification();
      return;
    }
    if (!reportReason) {
      notification.error({
        message: "Report Failed",
        description: "Please select a reason for reporting.",
        placement: "topRight",
      });
      return;
    }

    setReportLoading(true);
    try {
      //   await reportPostAPI(post._id, userId, reportReason, reportDescription);
      setIsReportModalOpen(false);
      setReportReason("");
      setReportDescription("");
      notification.success({
        message: "Report Submitted",
        description: "Thanks for reporting this post. We will review it soon.",
        placement: "topRight",
      });
    } catch (err) {
      console.error("Error reporting post:", err);
      notification.error({
        message: "Report Failed",
        description:
          err.message || "Failed to submit the report. Please try again.",
        placement: "topRight",
      });
    } finally {
      setReportLoading(false);
    }
  };
  const handleReportModalCancel = () => {
    setIsReportModalOpen(false);
    setReportReason("");
    setReportDescription("");
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/posts/${post._id}`;
    copyToClipboard(shareLink);
    setIsModalOpen(false);
  };

  const handleGoToPost = () => {
    const shareLink = `${window.location.origin}/posts/${post._id}`;
    window.open(shareLink, "_blank");
    setIsModalOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    touchMove: true,
    customPaging: (i) => (
      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50 mx-1 transition-opacity duration-300" />
    ),
    dotsClass: "slick-dots custom-dots",
    beforeChange: (current, next) => {
      handleVideoPause(current, videoRefs);
      handleVideoPause(current, commentVideoRefs);
      setCurrentSlide(next);
    },
    afterChange: (current) => {
      handleVideoPlay(current, videoRefs);
      handleVideoPlay(current, commentVideoRefs);
    },
  };

  const handleVideoPause = (current, refs = videoRefs) => {
    const video = refs.current[current];
    if (video) {
      video.pause();
    }
  };

  const handleVideoPlay = (current, refs = videoRefs) => {
    const video = refs.current[current];
    if (video && post.mediaFiles[current].type === "video") {
      video.muted = isMuted;
      video.play().catch((error) => console.log("Video play error:", error));
    }
  };

  const toggleMute = (refs = videoRefs) => {
    const video = refs.current[currentSlide];
    if (video) {
      const newMutedState = !video.muted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handlePrev = (ref = sliderRef) => ref.current.slickPrev();
  const handleNext = (ref = sliderRef) => ref.current.slickNext();

  const handleLikeClick = () => {
    // if (!userId) {
    //   showLoginNotification();
    //   return;
    // }
    // onLikeToggle(post._id, isLiked);
    dispatch(toggleLike(post._id));
  };

  const handleProfileNavigate = (userId) => {
    navigateProfile(userId);
  };

  const postMenu = (
    <Menu>
      <Menu.Item key="report" onClick={showReportModal}>
        Report
      </Menu.Item>
      <Menu.Item key="copyLink" onClick={handleCopyLink}>
        Copy Link
      </Menu.Item>
      <Menu.Item key="goToPost" onClick={handleGoToPost}>
        Go to Post
      </Menu.Item>
    </Menu>
  );

  const handleVisibilityChange = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) {
        videoRefs.current.forEach((video) => {
          if (video) {
            video.muted = true;
            video.pause();
            setIsMuted(true);
          }
        });
      } else {
        handleVideoPlay(currentSlide, videoRefs);
      }
    },
    [currentSlide, post.mediaFiles]
  );

  useEffect(() => {
    setPostTime(timeAgo(post.createdAt, loadTime.current));
  }, [post]);
  //   if (isCommentModalOpen) {
  //     const sorted = [...post.comments].sort((a, b) => {
  //       if (a.user?._id === userId && b.user?._id === userId) {
  //         return new Date(b.createdAt) - new Date(a.createdAt);
  //       }
  //       if (a.user?._id === userId && b.user?._id !== userId) return -1;
  //       if (a.user?._id !== userId && b.user?._id === userId) return 1;
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     });

  //     setSortedComments(sorted);

  //     const now = new Date();
  //     const updatedCommentTimes = sorted.map((comment) =>
  //       timeAgo(comment.createdAt, now)
  //     );
  //     setCommentTimes(updatedCommentTimes);

  //     if (commentSliderRef.current) {
  //       commentSliderRef.current.slickGoTo(currentSlide);
  //       setTimeout(() => {
  //         handleVideoPlay(currentSlide, commentVideoRefs);
  //       }, 100);
  //     }
  //   } else {
  //     handleVideoPause(currentSlide, commentVideoRefs);
  //   }
  // }, [isCommentModalOpen, post.comments, currentSlide, userId]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleVisibilityChange, {
      root: null,
      threshold: 0.5,
    });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    videoRefs.current = [];
    commentVideoRefs.current = [];
  }, [post]);

  const handleMouseEnter = () => {
    if (!userId) return;
    if (profileCardTimeoutRef.current) {
      clearTimeout(profileCardTimeoutRef.current);
    }
    setShowProfileCard(true);
  };

  const handleMouseLeave = () => {
    if (!userId) return;
    profileCardTimeoutRef.current = setTimeout(() => {
      setShowProfileCard(false);
    }, 200);
  };

  const shareLink = `${window.location.origin}/posts/${post._id}`;

  return (
    <div className="border-b border-gray-200 pb-4 bg-white" ref={cardRef}>
      {/* Header */}
      <div className="flex items-center px-3 py-2 justify-between text-sm font-semibold">
        <div className="flex items-center">
          <Avatar
            src={
              post.author?.profile?.avatar ||
              `https://i.pravatar.cc/150?u=${post.author?._id}`
            }
            icon={<UserOutlined />}
            className="border-2 border-pink-500 p-0.5 rounded-full"
            size={32}
          />
          <div className="ml-3 flex flex-col">
            <div
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                onClick={() => {
                  handleProfileNavigate(post?.author._id);
                }}
                className="font-semibold text-black hover:underline cursor-pointer"
              >
                {post.author?.username}
              </div>
              {showProfileCard && (
                <div
                  className="absolute z-50 top-6 left-0"
                  onMouseEnter={() =>
                    clearTimeout(profileCardTimeoutRef.current)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <ProfileCard
                    user={authorState}
                    onFollowChange={(newAuthor) => setAuthorState(newAuthor)}
                  />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-400">{postTime}</span>
          </div>
        </div>
        <Dropdown overlay={postMenu} trigger={["click"]}>
          <IoIosMore className="text-lg text-black cursor-pointer" />
        </Dropdown>
      </div>

      {/* Report Modal */}
      <Modal
        title="Report Post"
        open={isReportModalOpen}
        onOk={handleReportModalOk}
        onCancel={handleReportModalCancel}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={reportLoading}
        centered
      >
        <div className="flex flex-col gap-4">
          <Select
            placeholder="Select a reason"
            value={reportReason}
            onChange={(value) => setReportReason(value)}
            options={[
              { value: "spam", label: "Spam" },
              { value: "inappropriate", label: "Inappropriate content" },
              { value: "harassment", label: "Harassment or bullying" },
              { value: "hate_speech", label: "Hate speech" },
              {
                value: "violence",
                label: "Violence or dangerous organizations",
              },
              { value: "misinformation", label: "False information" },
            ]}
            className="w-full"
          />
          <Input.TextArea
            placeholder="Provide additional details (optional)"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        title="Share Post"
        open={isShareModalVisible}
        onCancel={handleShareModalCancel}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center bg-gray-100 p-2 rounded">
            <Input
              value={shareLink}
              readOnly
              className="flex-1 mr-2 border-none bg-transparent"
            />
            <Button type="primary" onClick={() => copyToClipboard(shareLink)}>
              Copy
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isPostDetailOpen}
        onCancel={() => setIsPostDetailOpen(false)}
        footer={null}
        width="90vw"
        style={{ maxWidth: 1200 }}
        centered
        destroyOnHidden
      >
        <PostDetailPage
          postId={post._id}
          onClose={() => setIsPostDetailOpen(false)}
        />
      </Modal>

      {/* Post Media Carousel */}
      <div className="relative">
        <Slider ref={sliderRef} {...sliderSettings}>
          {post.mediaFiles.map((media, index) => (
            <div key={index} className="w-full h-[585px] relative">
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={`post-media-${index}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={media.url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                  />
                  <button
                    className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                    onClick={() => toggleMute(videoRefs)}
                  >
                    {isMuted ? <AudioMutedOutlined /> : <SoundOutlined />}
                  </button>
                </>
              )}
            </div>
          ))}
        </Slider>
        {post.mediaFiles.length > 1 && (
          <>
            {currentSlide !== 0 && (
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                onClick={() => handlePrev(sliderRef)}
              >
                <LeftOutlined className="text-black text-sm" />
              </button>
            )}
            {currentSlide !== post.mediaFiles.length - 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                onClick={() => handleNext(sliderRef)}
              >
                <RightOutlined className="text-black text-sm" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex justify-between px-3 pt-2 text-2xl">
        <div className="flex gap-3">
          {post.isLiked ? (
            <HeartFilled
              className="cursor-pointer text-red-500 hover:text-gray-400"
              onClick={handleLikeClick}
            />
          ) : (
            <HeartOutlined
              className="cursor-pointer text-black hover:text-gray-400"
              onClick={handleLikeClick}
            />
          )}
          <MessageOutlined
            className="text-black hover:text-gray-400 cursor-pointer"
            onClick={showPostDetailModal}
          />
          <SendOutlined
            className="text-black hover:text-gray-400 cursor-pointer"
            onClick={showShareModal}
          />
        </div>
      </div>

      {/* Likes */}
      <div className="px-3 pt-1 text-sm font-semibold text-black">
        {post.likeCount} likes
      </div>

      {/* Caption */}
      <div className="px-3 pt-1 pb-2 text-sm">
        <span className="font-semibold mr-2 text-black">
          {post.author?.username || `user${post.author?._id}`}
        </span>
        <span className="text-black">{post.caption}</span>
      </div>

      {/* Optional: Show a preview of comments */}
      {post.comments.length > 0 && (
        <div className="px-3 text-sm text-gray-600">
          <div className="cursor-pointer">
            View all {post.comments.length} comments
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
