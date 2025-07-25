import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ToBoSocialImage from "../assets/tobosocial.png";
import { register } from "../redux/auth.slice";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, name, email, password, confirmPassword } = formData;

    // Kiểm tra rỗng
    if (!username || !name || !email || !password || !confirmPassword) {
      setModalMessage("Vui lòng nhập đầy đủ thông tin!");
      setShowModal(true);
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setModalMessage("Mật khẩu xác nhận không khớp!");
      setShowModal(true);
      return;
    }

    try {
      // Call register API via Redux thunk
      await dispatch(
        register({
          username,
          email,
          password,
          fullName: name,
        })
      ).unwrap();

      // On success, show success message and redirect to login
      setModalMessage("Đăng ký thành công!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      // Handle specific errors (e.g., username/email already exists)
      setModalMessage(
        err.message.includes("username") || err.message.includes("email")
          ? "Tên đăng nhập hoặc email đã tồn tại. Vui lòng chọn giá trị khác!"
          : "Có lỗi xảy ra khi đăng ký!"
      );
      setShowModal(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-600 ">
      <div className="flex w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img
            src={ToBoSocialImage}
            alt="ToboSocial"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 justify-center items-center">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Register
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              disabled={authStatus === "loading"}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {authStatus === "loading" ? "Đang đăng ký..." : "Submit"}
            </button>
          </form>
          {/* Dòng dẫn về trang đăng nhập */}
          <p className="text-center mt-4 text-sm">
            Have a account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Dark overlay backdrop */}
          <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"></div>

          {/* Modal container with improved styling */}
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-96 border-2 border-blue-200 transform transition-all duration-300 scale-100 animate-fadeIn">
            {/* Optional icon for visual emphasis */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Message with improved typography */}
            <p className="text-center text-lg font-medium mb-6">
              {modalMessage}
            </p>

            {/* Button with improved styling */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
