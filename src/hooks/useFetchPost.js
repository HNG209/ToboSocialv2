import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, fetchPostDetail } from "../redux/post.slice";

export default function useFetchPost(id) {
  const [postId, setPostId] = useState(id);
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.current);

  useEffect(() => {
    // console.log("id", postId);
    if (postId != null && postId != undefined) {
      dispatch(fetchPost(postId));
      dispatch(fetchPostDetail(postId));
    }
  }, [postId]);

  return [post, setPostId];
}
