import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPost,
  fetchPostAuthor,
  fetchPostDetail,
} from "../redux/post.slice";

export default function useFetchPost(id) {
  const [postId, setPostId] = useState(id);
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.current);
  const status = useSelector((state) => state.post.status);
  const error = useSelector((state) => state.post.error);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostAuthor(postId));
      dispatch(fetchPost(postId));
      dispatch(fetchPostDetail(postId));
    }
  }, [postId, dispatch]);

  return [post, setPostId, status, error];
}
