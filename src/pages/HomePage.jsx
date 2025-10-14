import { useEffect, useRef } from "react";
import PostCard from "../components/postCard";
import { message, Spin } from "antd";
import useFeed from "../hooks/useFeed";

function HomePage() {
  const { posts, status, userId, fetchMore } = useFeed();
  // ref cho sentinel (thẻ rỗng ở cuối danh sách để observe)
  const sentinelRef = useRef(null);
  // guard để tránh gọi fetch trùng cho cùng cursor
  const lastFetchedCursorRef = useRef(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (!ent.isIntersecting) return;

        // không fetch nếu đang loading
        if (status === "loading") return;

        // compute cursor from last post
        const lastPostScore = posts.length
          ? posts[posts.length - 1].score
          : null;

        // nếu đã fetch cho cursor này thì skip
        if (lastFetchedCursorRef.current === lastPostScore) return;

        // set guard và dispatch fetch thêm
        lastFetchedCursorRef.current = lastPostScore;
        fetchMore();
        // console.log("Fetching more posts with cursor:", lastPostScore);
      },
      {
        root: null,
        rootMargin: "300px", // trigger sớm khi còn 300px tới cuối
        threshold: 0,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [posts, status]);

  return (
    <div className="flex justify-center bg-white">
      <div className="w-full max-w-[630px] border-x border-gray-200 min-h-screen">
        {status === "loading" && posts.length === 0 && (
          <div className="flex justify-center mt-10 h-full">
            <Spin />
          </div>
        )}

        {posts.length > 0 &&
          posts.map((post, index) => (
            <PostCard key={post._id} post={post} userId={userId} />
          ))}

        {status === "loading" && posts.length > 0 && (
          <div className="flex justify-center my-2">
            <Spin />
          </div>
        )}

        {status === "failed" && message.error("Error loading posts")}

        {/* sentinel: invisible element observed để trigger load thêm */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {posts.length > 0 && status !== "loading" && (
          <p className="text-center text-sm text-gray-400">Cuộn để tải thêm</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
