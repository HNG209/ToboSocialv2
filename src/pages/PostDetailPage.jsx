import { useState, useEffect, useRef } from "react";
import { Avatar, message, Modal } from "antd";
import {
  Send,
  MessageCircle,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  HeartOutlined,
  HeartFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Skeleton, Spin } from "antd";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createComment,
  deletePost,
  fetchMoreComments,
  fetchRepliesComment,
  toggleLike,
} from "../redux/post.slice";
import Comment from "../components/Comment";
import useFetchPost from "../hooks/useFetchPost";
import AnimateComponent from "../components/AnimateComponent";
import useFetchHighlightComment from "../hooks/useFetchHighlightComment";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-1 rounded-full"
    onClick={onClick}
  >
    <ChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-1 rounded-full"
    onClick={onClick}
  >
    <ChevronLeft size={24} />
  </div>
);

const PostDetailPage = ({ onClose, postId, root, replyTo, commentId }) => {
  const scrollContainerRef = useRef(null);

  const [muted, setMuted] = useState(true);
  const [repliedComment, setRepliedComment] = useState(commentId); // dùng để animate, nhận id
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const [postDetail] = useFetchPost(postId); // custom hook
  const [setRoot, setReplyTo, setCommentId] = useFetchHighlightComment(
    root,
    replyTo,
    commentId
  );
  const authUser = useSelector((state) => state.auth.user);
  const postComments = useSelector((state) => state.post.comments);
  const likeStatus = useSelector((state) => state.post.current.isLiked);
  const status = useSelector((state) => state.post.status);
  const commentLoading = useSelector(
    (state) => state.post.isLoadingMoreComments
  );
  const fetchMore = useSelector((state) => state.post.fetchMore); // check if there're more comments to load

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOptionsClick = () => setIsOptionsModalOpen(true);
  const handleOptionsClose = () => setIsOptionsModalOpen(false);

  // useEffect(() => {
  //   dispatch(
  //     fetchHighLightComments({
  //       root: "6889f206a872c45718cb08dd",
  //       lv1: "688b3b3bd312b020877e66c4",
  //     })
  //   );
  // }, []);

  const handleDeletePost = () => {
    Modal.confirm({
      title: "Xác nhận xoá bài viết",
      content: "Bạn có chắc chắn muốn xoá bài viết này không?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        dispatch(deletePost());
        setIsOptionsModalOpen(false);
        message.success("Bài viết đã xoá thành công");
        onClose();
      },
    });
  };

  const handleReportPost = () => {
    // TODO: Thêm logic báo cáo bài viết ở đây

    setIsOptionsModalOpen(false);
  };

  const handlePostUpdate = () => {
    navigate(`/update/post/${postDetail._id}`);
    setIsOptionsModalOpen(false);
  };

  const handleViewPost = () => {
    // TODO: Thêm logic xem bài viết (có thể chuyển hướng)
    setIsOptionsModalOpen(false);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10; // margin nhỏ

    if (isAtBottom) {
      // Gọi API để fetch thêm bình luận
      if (!commentLoading && status === "succeeded") {
        dispatch(fetchMoreComments());
      }
    }
  };

  useEffect(() => {
    setReplyToComment(null); // Reset reply state when postDetail changes
    setComments(postComments);
  }, [postComments]);

  useEffect(() => {
    setIsLiked(likeStatus);
  }, [likeStatus]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentPost = async () => {
    await dispatch(
      createComment({
        post: postDetail._id,
        text: comment,
        replyTo: replyToComment !== null ? replyToComment.commentId : null, // bình luận gốc thì replyTo = null
        rootComment:
          replyToComment !== null ? replyToComment.rootComment : null, // bình luận gốc thì rootComment = null
        childOf:
          replyToComment !== null
            ? [...replyToComment.childOf, replyToComment.commentId]
            : [], // bình luận gốc thì mảng childOf là rỗng
      })
    );
    setComment("");
  };

  const togglePostLike = () => {
    dispatch(toggleLike(postDetail._id));
  };

  const toggleMute = () => setMuted(!muted);

  const handleCommentReply = (comment) => {
    setReplyToComment(comment);
  };

  const handleViewMoreReplies = (commentId) => {
    dispatch(fetchRepliesComment(commentId));
  };

  const handleCancelReply = () => {
    setReplyToComment(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const renderMedia = (media, index) => (
    <div
      key={index}
      className="h-[70vh] w-full flex items-center justify-center bg-black"
    >
      {media.type === "image" ? (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={media.url}
            alt="Post media"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-full">
          <video
            src={media.url}
            className="max-h-full max-w-full object-contain"
            controls
            muted={muted}
            autoPlay
            loop
          />
          <button
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
            onClick={toggleMute}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white flex flex-col lg:flex-row rounded-lg overflow-hidden w-full max-h-[90vh]">
      {/* Media */}
      <div className="w-full lg:w-3/5 bg-black relative flex items-center justify-center h-[70vh]">
        <div className="h-full w-full">
          <Slider {...sliderSettings}>
            {Array.isArray(postDetail.mediaFiles) &&
              postDetail.mediaFiles.map((media, index) =>
                renderMedia(media, index)
              )}
          </Slider>
        </div>
      </div>

      {/* Right (desktop) or Bottom (mobile) */}
      <div className="w-full lg:w-2/5 flex flex-col p-4 text-sm max-h-[50vh] lg:max-h-full overflow-y-auto">
        {/* User Info */}
        <div className="flex items-center justify-between space-x-2 mb-3 border-b pb-2">
          <div>
            <Avatar
              size={30}
              className="absolute top-0 left-0 z-10 m-4"
              src={
                postDetail?.author?.profile?.avatar ||
                "https://res.cloudinary.com/dwaldcj4v/image/upload/v1745215451/sodmg5jwxc8m2pho0i8r.jpg"
              }
            >
              <img
                src="https://i.pravatar.cc/150?u=user"
                alt="user"
                className="w-full object-cover max-h-[600px]"
              />
            </Avatar>
            <span className="ml-2 font-semibold">
              {"@" + postDetail?.author?.username}
            </span>
            {/* <span className='ml-2'>{`- ${userData?.fullName}`}</span> */}
            <span className="ml-1">{postDetail.caption}</span>
          </div>
          <EllipsisOutlined
            onClick={handleOptionsClick}
            className="ml-2 hover:text-blue-500 hover:cursor-pointer text-lg"
          />
        </div>
        <Modal
          open={isOptionsModalOpen}
          onCancel={handleOptionsClose}
          footer={null}
          closable={false} // Ẩn nút đóng mặc định
          centered
        >
          <div className="flex flex-col space-y-3">
            {
              // block quyền xoá bài viết nếu không phải người đăng nhập trên front-end (đã chặn trong back-end)
              authUser._id === postDetail.author?._id && ( // comment để test cho back-end
                <button
                  className="text-red-500 shadow-sm font-semibold py-2 hover:bg-gray-100 rounded"
                  onClick={handleDeletePost}
                >
                  Xoá bài viết
                </button>
              )
            }
            {authUser._id === postDetail.author?._id && ( // chỉ cho phép chủ bài viết chỉnh sửa
              <button
                className="text-gray-500 shadow-sm font-semibold py-2 hover:bg-gray-100 rounded"
                onClick={handlePostUpdate}
              >
                Chỉnh sửa bài viết
              </button>
            )}
            <button
              className="text-gray-500 shadow-sm font-semibold py-2 hover:bg-gray-100 rounded"
              onClick={handleReportPost}
            >
              Báo cáo
            </button>
            <button
              className="text-gray-500 shadow-sm font-semibold py-2 hover:bg-gray-100 rounded"
              onClick={handleViewPost}
            >
              Xem bài viết
            </button>
            <button
              className="py-2 shadow-sm hover:bg-gray-100 rounded"
              onClick={handleOptionsClose}
            >
              Đóng
            </button>
          </div>
        </Modal>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="space-y-2 mb-4 h-100 sm:max-h-80 md:max-h-96 overflow-y-auto"
        >
          {status === "loading" && comments.length === 0 ? (
            <Skeleton active className="mt-2 ml-2" />
          ) : (
            comments.map((c) => (
              <div className="flex flex-col" key={c._id}>
                <AnimateComponent
                  trigger={repliedComment === c._id}
                  onComplete={() => {
                    setRepliedComment(null);
                  }}
                >
                  <Comment
                    // ref={repliedComment === c._id ? commentRef : null}
                    comment={c}
                    replyToComment={replyToComment}
                    handleCommentReply={handleCommentReply}
                    handleCancelReply={handleCancelReply}
                    onClose={onClose}
                  />
                </AnimateComponent>
                {c.replies &&
                  c.replies.length > 0 &&
                  c.replies.map((reply) => (
                    <div className="ml-5" key={reply._id}>
                      <AnimateComponent
                        trigger={repliedComment === reply._id}
                        onComplete={() => {
                          setRepliedComment(null);
                        }}
                      >
                        <Comment
                          // ref={repliedComment === reply._id ? commentRef : null}
                          comment={reply}
                          replyToComment={replyToComment}
                          handleCommentReply={handleCommentReply}
                          handleCancelReply={handleCancelReply}
                          onClose={onClose}
                          setReplied={setRepliedComment}
                        />
                      </AnimateComponent>
                    </div>
                  ))}
                {c.replies &&
                  c.replies.length > 0 &&
                  c?.pagination?.hasNextPage && (
                    <div
                      className="text-xs text-gray-500 mt-2 text-center cursor-pointer hover:text-blue-500"
                      onClick={() => handleViewMoreReplies(c._id)}
                    >
                      view more replies...
                    </div>
                  )}
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-gray-600">
            <div className="flex space-x-4">
              {isLiked ? (
                <HeartFilled
                  onClick={togglePostLike}
                  size={30}
                  className="cursor-pointer text-2xl"
                />
              ) : (
                <HeartOutlined
                  onClick={togglePostLike}
                  size={30}
                  className="cursor-pointer text-2xl"
                />
              )}
              {/* <Heart className="cursor-pointer" /> */}
              <MessageCircle className="cursor-pointer" />
              <Send className="cursor-pointer" />
              {status === "loading" && fetchMore && (
                <div className="flex items-center justify-center">
                  <Spin />
                </div>
              )}
            </div>
            <Bookmark className="cursor-pointer" />
          </div>
          <div className="text-sm font-semibold">
            {postDetail?.likeCount || 0} likes
          </div>

          {/* Comment input */}
          <div className="flex items-center border-t pt-2">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder={
                replyToComment
                  ? "reply to " +
                    (replyToComment?.username
                      ? `@${replyToComment?.username}`
                      : "")
                  : "Add a comment..."
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && comment.trim()) {
                  handleCommentPost();
                  setReplyToComment(null); // Reset reply after posting
                }
              }}
              className="flex-1 outline-none"
            />
            <button
              className={`text-blue-500 font-semibold ml-2 ${
                !comment.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleCommentPost}
              disabled={!comment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
