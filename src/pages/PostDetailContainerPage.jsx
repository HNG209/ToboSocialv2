import { useParams } from "react-router-dom";
import PostDetailPage from "./PostDetailPage";
import { useQuery } from "../hooks/useQuery";

export default function PostDetailContainerPage() {
  const { postId } = useParams();
  const query = useQuery();

  // useEffect(() => {
  //   for (const [key, value] of query.entries()) {
  //     console.log(key, value);
  //   }
  // }, []);

  return (
    <div className="px-5 h-full flex justify-center items-center">
      <PostDetailPage
        postId={postId}
        root={query.get("root")}
        replyTo={query.get("replyTo")}
        commentId={query.get("commentId")}
      />
    </div>
  );
}
