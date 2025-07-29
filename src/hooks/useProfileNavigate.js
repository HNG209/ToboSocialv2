import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useProfileNavigate() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const navigateProfile = (userId) => {
    if (!userId) return;

    if (userId === authUser._id) navigate("/profile");
    else navigate(`/profile/${userId}`);
  };

  return navigateProfile;
}
