import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/postCard";
import { fetchUserFeed } from "../redux/feed.slice";

function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.feed.posts);
  // const posts = [];
  //   const status = useSelector((state) => state.posts.status);
  //   const currentPage = useSelector((state) => state.posts.currentPage);
  //   const hasMore = useSelector((state) => state.posts.hasMore);
  const userId = useSelector((state) => state.auth.user?._id);

  const observer = useRef();

  // Callback for Intersection Observer
  const lastPostElementRef = useCallback((node) => {
    if (status === "loading") return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      //   if (entries[0].isIntersecting && hasMore) {
      //     //   dispatch(fetchPosts({ page: currentPage + 1 }));
      //   }
    });

    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    dispatch(fetchUserFeed({ page: 1, limit: 10 }));
  }, [dispatch]);

  // const showLoginNotification = () => {
  //   notification.warning({
  //     message: "Authentication Required",
  //     description:
  //       "Please log in to interact with posts, or continue viewing without interaction.",
  //     placement: "topRight",
  //     duration: 0, // Keep notification open until user interacts
  //     btn: (
  //       <div className="flex gap-2">
  //         <Button
  //           type="primary"
  //           onClick={() => {
  //             notification.destroy();
  //             navigate("/login");
  //           }}
  //         >
  //           Log In
  //         </Button>
  //         <Button onClick={() => notification.destroy()}>
  //           Continue Viewing
  //         </Button>
  //       </div>
  //     ),
  //   });
  // };

  return (
    <div className="flex justify-center bg-white">
      <div className="w-full max-w-[630px] border-x border-gray-200 min-h-screen">
        {status === "loading" && posts.length === 0 && (
          <p className="loading">Loading posts...</p>
        )}
        {posts.length > 0 &&
          posts.map((post, index) => {
            // Attach ref to the last post for Intersection Observer
            if (index === posts.length - 1) {
              return (
                <div ref={lastPostElementRef} key={post._id}>
                  <PostCard
                    post={post}
                    userId={userId}
                  />
                </div>
              );
            }
            return (
              <PostCard
                key={post._id}
                post={post}
                userId={userId}
              />
            );
          })}
        {status === "loading" && posts.length > 0 && (
          <p className="loading">Loading more posts...</p>
        )}
        {status === "failed" && <p className="error">Error loading posts</p>}
        {posts.length > 0 && <p className="loading">No more posts to load</p>}
      </div>
    </div>
  );
}

export default HomePage;
