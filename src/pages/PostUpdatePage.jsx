import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Upload, message, Spin, Card, Modal } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, updatePost } from "../redux/post.slice";

const { TextArea } = Input;

const PostUpdatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams(); //post ID
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const user = useSelector((state) => state.auth.user); // Lấy user từ Redux

  const currentPost = useSelector((state) => state.post.current);

  // const CLOUDINARY_UPLOAD_PRESET = "testUploadImage";
  // const CLOUDINARY_CLOUD_NAME = "dai4ctigv";

  useEffect(() => {
    dispatch(fetchPost(id));
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      caption: currentPost.caption,
    });
  }, [currentPost, form]);

  useEffect(() => {
    if (!currentPost.mediaFiles) return;
    setCurrentFiles([...currentFiles, ...currentPost.mediaFiles]);
  }, [currentPost.mediaFiles]);

  const handleRemoveLocalFile = (index) => {
    setCurrentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const uploadData = new FormData();

      // Lọc ra những file sẽ được upload lên cloudinary
      const uploading = currentFiles.filter((f) => !f.url);
      const uploadedFiles = currentFiles.filter((f) => f.url);

      console.log("uploading", uploading);
      uploading.forEach((i) => {
        uploadData.append("mediaFiles", i.file);
      });

      const postData = {
        postId: id,
        author: user._id,
        caption: values.caption,
        mediaFiles: uploadedFiles, // giữ những file cần giữ, nếu loại ra sẽ bị xoá
      };
      uploadData.append("content", JSON.stringify(postData));

      dispatch(updatePost({ postId: id, data: uploadData }));
      message.success("Cập nhật thành công!");

      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật");
    } finally {
      setLoading(false);
      navigate("/profile");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md rounded-lg">
        <h3 className="text-indigo-800 mb-4 text-xl font-semibold">
          <EditOutlined /> Chỉnh sửa bài đăng
        </h3>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="caption"
            label="Nội dung bài viết"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung bài viết" },
              { max: 500, message: "Nội dung không được vượt quá 500 ký tự" },
            ]}
          >
            <TextArea
              rows={4}
              showCount
              maxLength={500}
              disabled={loading || uploading}
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="mediaFiles"
            label="Ảnh/Video"
            // rules={[
            //     {
            //         validator: () => {
            //             if (mediaFiles.length === 0) {
            //                 return Promise.reject(new Error('Vui lòng tải lên ít nhất một ảnh hoặc video'));
            //             }
            //             return Promise.resolve();
            //         },
            //     },
            // ]}
          >
            <Upload
              beforeUpload={(file) => {
                // kiểm tra định dạng
                if (
                  ![
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "video/mp4",
                    "video/webm",
                  ].includes(file.type)
                ) {
                  message.error(
                    "Chỉ hỗ trợ ảnh (JPEG, PNG, GIF) hoặc video (MP4, WebM)"
                  );
                  return Upload.LIST_IGNORE;
                }

                const previewUrl = URL.createObjectURL(file);
                setCurrentFiles((prev) => [
                  // Files sẽ được upload
                  ...prev,
                  {
                    file,
                    previewUrl,
                    type: file.type.startsWith("video") ? "video" : "image",
                  },
                ]);
                return false; // không upload tự động
              }}
              showUploadList={false}
              accept="image/*,video/*"
              multiple
              disabled={loading || uploading}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                className="border-gray-300 hover:bg-gray-100 rounded-lg"
              >
                Chọn ảnh hoặc video
              </Button>
            </Upload>

            {currentFiles.length > 0 && (
              <div className="mt-2">
                <span style={{ fontWeight: "bold" }}>
                  Đã upload ({currentFiles.length}) file:
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {currentFiles.map((fileObj, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        border: "1px solid #e8e8e8",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      {fileObj.type === "image" ? (
                        <img
                          src={fileObj.previewUrl || fileObj.url}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          onClick={() => handlePreview(fileObj)}
                        />
                      ) : (
                        <video
                          src={fileObj.previewUrl || fileObj.url}
                          controls
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          onClick={() => handlePreview(fileObj)}
                        />
                      )}
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleRemoveLocalFile(index)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(255, 0, 0, 0.7)",
                          border: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              htmlType="submit"
              loading={loading}
              disabled={loading || uploading}
              className="bg-indigo-500 hover:bg-indigo-600 rounded-lg"
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
        <Spin spinning={uploading || loading} />
      </Card>
      <style jsx>{`
        .ant-btn-danger:hover {
          background: rgba(255, 0, 0, 1) !important;
        }
        .ant-upload-select {
          margin-bottom: 10px;
        }
        .ant-modal-content {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default PostUpdatePage;
