import { Avatar, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostByUser, getCurrentUser } from "../redux/profile.slice";

export default function ProfileEditPage() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.user);

  useEffect(() => {
    dispatch(getCurrentUser({}));
    dispatch(fetchPostByUser({ page: 1, limit: 10 }));
  }, []);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile?.fullName || "");
      setBio(profile?.profile?.bio || "");
      setEmail(profile?.email || "");
    }
  }, [profile]);

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showModal();
  };

  const handleSaveChanges = async () => {
    // const uploadedUrl = await handleUpload(); // Wait for the upload to complete
    // const avatar = uploadedUrl || profile?.profile?.avatar; // Use the uploaded URL or fallback to the current avatar
    // await dispatch(
    //   updateUser({
    //     _id: profile._id,
    //     email,
    //     fullName: name,
    //     profile: {
    //       bio,
    //       avatar,
    //     },
    //   })
    // ); // Dispatch the update action
    // await dispatch(getCurrentUser({})); // Fetch the updated user data
    // setIsModalOpen(false);
    // navigate("/profile"); // Redirect to profile page after saving changes
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-4 relative">
          <Avatar
            size={120}
            className="absolute top-0 left-0 z-10 m-4"
            src={
              profile?.profile?.avatar ||
              "https://res.cloudinary.com/dwaldcj4v/image/upload/v1745215451/sodmg5jwxc8m2pho0i8r.jpg"
            }
          >
            <img
              src="https://i.pravatar.cc/150?u=user"
              alt="user"
              className="w-full object-cover max-h-[600px]"
            />
          </Avatar>
          <ImageUploader className="absolute top-0 left-0 z-10 m-4" />
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Display name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="username"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              id="bio"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 mb-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              navigate("/profile");
            }}
            type="submit"
            className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Return
          </button>
        </form>
      </div>

      <Modal
        closable={false}
        centered={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p className="text-center mb-4">
          Are you sure you want to save the changes?
        </p>
        <Button
          size={"medium"}
          className="w-full mb-2"
          onClick={handleSaveChanges}
        >
          Confirm
        </Button>
        <Button
          danger
          size={"medium"}
          className="w-full mb-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Modal>
    </div>
  );
}
