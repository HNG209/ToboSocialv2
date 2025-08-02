import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchHighLightComments } from "../redux/comment.slice";

export default function useFetchHighlightComment(rootId, replyToId, commentId) {
  const [root, setRoot] = useState(rootId);
  const [replyTo, setReplyTo] = useState(replyToId);
  const [comId, setCommentId] = useState(commentId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchHighLightComments({
        root: rootId,
        lv1: replyTo,
        lv2: comId,
      })
    );
  }, [root, replyTo, comId, dispatch]);

  return [setRoot, setReplyTo, setCommentId];
}
