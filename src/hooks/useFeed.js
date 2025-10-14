import { useDispatch, useSelector } from "react-redux";
import { fetchMorePosts, fetchUserFeed } from "../redux/feed.slice";
import { useEffect } from "react";

export default function useFeed() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.feed.posts || []);
    const status = useSelector((state) => state.feed.status);
    const userId = useSelector((state) => state.auth.user?._id);

    const fetchMore = () => {
        const lastPostScore = posts.length ? posts[posts.length - 1].score : null;
        dispatch(fetchMorePosts({ cursor: lastPostScore, limit: 2 }));
    };

    useEffect(() => {
        dispatch(fetchUserFeed());
    }, [dispatch]);

    return { posts, status, userId, fetchMore };
}
