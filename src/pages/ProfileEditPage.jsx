import React, { useState, useRef } from "react";
import {
  Card,
  Avatar,
  Button,
  Divider,
  Typography,
  List,
  Space,
  Select,
  Modal,
  Input,
  Form,
  message,
  Row,
  Col,
  Radio,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  BankOutlined,
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { editProfileAPI } from "../services/user.service";

const { Title, Text } = Typography;

// Cấu hình các group và key cứng
const GROUPS = [
  {
    key: "work",
    label: "Công việc",
    icon: <BankOutlined />,
    color: "#1890ff",
    keys: [
      { key: "company", label: "Công ty" },
      { key: "position", label: "Chức vụ" },
      { key: "experience", label: "Kinh nghiệm" },
    ],
  },
  {
    key: "education",
    label: "Học vấn",
    icon: <BookOutlined />,
    color: "#52c41a",
    keys: [
      { key: "university", label: "Trường đại học/cao đẳng" },
      { key: "highschool", label: "Trường trung học phổ thông" },
      { key: "major", label: "Chuyên ngành" },
    ],
  },
  {
    key: "places",
    label: "Nơi từng sống",
    icon: <HomeOutlined />,
    color: "#13c2c2",
    keys: [
      { key: "city", label: "Thành phố" },
      { key: "country", label: "Quốc gia" },
    ],
  },
];

const groupMap = GROUPS.reduce((acc, g) => {
  acc[g.key] = g;
  return acc;
}, {});

const genderOptions = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

const ProfileEditPage = () => {
  const user = useSelector((state) => state.auth.user);

  // Avatar & name state
  const [avatar, setAvatar] = useState(
    user?.profile?.avatar || `https://i.pravatar.cc/150?u=${user?._id}`
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [displayName, setDisplayName] = useState(
    user?.profile?.displayName || user?.fullName || user?.username || ""
  );
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [gender, setGender] = useState(user?.profile?.gender || "other");
  const fileInputRef = useRef();

  // Danh sách các group đã chọn để hiển thị
  const [activeGroups, setActiveGroups] = useState([]);
  // Dữ liệu các thuộc tính từng group
  const [attributes, setAttributes] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [editingAttr, setEditingAttr] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);

  // State cho form modal
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Thêm group mới
  const handleAddGroup = () => {
    Modal.confirm({
      title: "Chọn nhóm để thêm",
      content: (
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn nhóm"
          options={GROUPS.filter((g) => !activeGroups.includes(g.key)).map(
            (g) => ({
              value: g.key,
              label: g.label,
            })
          )}
          onChange={(val) => {
            setActiveGroups([...activeGroups, val]);
            Modal.destroyAll();
          }}
        />
      ),
      icon: null,
      okButtonProps: { style: { display: "none" } },
      cancelText: "Đóng",
      closable: true,
      maskClosable: true,
    });
  };

  // Thêm thuộc tính cho group
  const handleAdd = (groupKey) => {
    setModalMode("add");
    setEditingAttr(null);
    setCurrentGroup(groupKey);
    form.resetFields();
    form.setFieldsValue({ group: groupKey });
    setModalOpen(true);
  };

  // Sửa thuộc tính
  const handleEdit = (attr, idx, groupKey) => {
    setModalMode("edit");
    setEditingAttr({ ...attr, idx });
    setCurrentGroup(groupKey);
    form.setFieldsValue(attr);
    setModalOpen(true);
  };

  // Lưu thuộc tính
  const handleSaveAttr = () => {
    form.validateFields().then((values) => {
      const groupKey = values.group;
      const groupAttrs = attributes[groupKey] || [];
      if (modalMode === "add") {
        setAttributes({
          ...attributes,
          [groupKey]: [...groupAttrs, values],
        });
      } else if (modalMode === "edit" && editingAttr) {
        const newAttrs = [...groupAttrs];
        newAttrs[editingAttr.idx] = values;
        setAttributes({
          ...attributes,
          [groupKey]: newAttrs,
        });
      }
      setModalOpen(false);
    });
  };

  // Xoá thuộc tính
  const handleDelete = (idx, groupKey) => {
    const groupAttrs = attributes[groupKey] || [];
    setAttributes({
      ...attributes,
      [groupKey]: groupAttrs.filter((_, i) => i !== idx),
    });
  };

  // Xoá cả group
  const handleDeleteGroup = (groupKey) => {
    setActiveGroups(activeGroups.filter((g) => g !== groupKey));
    const newAttrs = { ...attributes };
    delete newAttrs[groupKey];
    setAttributes(newAttrs);
  };

  // Đổi avatar
  const handleAvatarChange = (info) => {
    const file = info.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ chọn file ảnh!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  // Đổi tên
  const handleNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  // Lưu toàn bộ form
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("profile[displayName]", displayName);
      formData.append("profile[bio]", bio);
      formData.append("profile[gender]", gender);
      if (avatarFile) {
        formData.append("profile[avatar]", avatarFile);
      } else {
        formData.append("profile[avatar]", avatar);
      }
      // introduction: array
      const introArr = [];
      Object.entries(attributes).forEach(([group, arr]) => {
        arr.forEach((item) => {
          introArr.push({
            key: item.key,
            value: item.value,
            group,
          });
        });
      });
      formData.append("introduction", JSON.stringify(introArr));

      await editProfileAPI(formData);
      setTimeout(() => {
        message.success("Cập nhật thành công!");
        setSaving(false);
      }, 1200);
    } catch (err) {
      message.error("Có lỗi xảy ra khi lưu!");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col py-6 px-2 bg-white min-h-screen text-[#222]">
      {/* Header: Avatar + Name + Basic Info */}
      <Card
        className="!rounded-xl !mb-4 !bg-gradient-to-r !from-blue-100 !to-blue-50 !border-0"
        bodyStyle={{
          background: "transparent",
          padding: 24,
        }}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <div className="relative group" style={{ width: 90, height: 90 }}>
              <Avatar
                size={90}
                src={avatar}
                icon={<UserOutlined />}
                style={{ border: "2px solid #1890ff", background: "#fff" }}
              />
              <Button
                shape="circle"
                icon={<UploadOutlined />}
                size="small"
                className="absolute bottom-1 right-1 !bg-white !border !border-blue-400 !text-blue-600 group-hover:!opacity-100 opacity-80"
                style={{ zIndex: 2 }}
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </div>
          </Col>
          <Col flex="auto">
            <Input
              value={displayName}
              onChange={handleNameChange}
              maxLength={50}
              className="!text-xl !font-bold !bg-white !border-0 !shadow-none !px-0 !py-1 !text-blue-900"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#1d3557",
                background: "transparent",
              }}
              bordered={false}
              placeholder="Nhập tên hiển thị"
            />
            <div>
              <Text type="secondary" className="!text-blue-400">
                @{user?.username}
              </Text>
            </div>
            <div className="mt-2">
              <Input.TextArea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="Giới thiệu bản thân"
                className="!bg-white !border !border-blue-100 !rounded"
                style={{ resize: "none" }}
              />
            </div>
            <div className="mt-2">
              <Radio.Group
                options={genderOptions}
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Nút thêm group nếu còn group chưa chọn */}
      {activeGroups.length < GROUPS.length && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="mb-4"
          onClick={handleAddGroup}
        >
          Thêm nhóm thông tin
        </Button>
      )}

      {/* Hiển thị các group đã chọn */}
      {activeGroups.map((groupKey) => {
        const group = groupMap[groupKey];
        return (
          <Section
            key={group.key}
            group={group}
            attributes={attributes[group.key] || []}
            onAdd={() => handleAdd(group.key)}
            onEdit={(attr, idx) => handleEdit(attr, idx, group.key)}
            onDelete={(idx) => handleDelete(idx, group.key)}
            onDeleteGroup={() => handleDeleteGroup(group.key)}
          />
        );
      })}

      {/* Modal thêm/sửa thuộc tính */}
      <Modal
        open={modalOpen}
        title={modalMode === "add" ? "Thêm thông tin" : "Chỉnh sửa thông tin"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveAttr}
        okText={modalMode === "add" ? "Thêm" : "Lưu"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={
            editingAttr || { group: currentGroup, key: undefined, value: "" }
          }
        >
          <Form.Item name="group" label="Nhóm" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prev, curr) => prev.group !== curr.group}
            noStyle
          >
            {() => {
              const groupKey = form.getFieldValue("group") || currentGroup;
              const keys = groupMap[groupKey]?.keys || [];
              return (
                <Form.Item
                  name="key"
                  label="Thuộc tính"
                  rules={[{ required: true, message: "Chọn thuộc tính" }]}
                >
                  <Select
                    options={keys.map((k) => ({
                      value: k.key,
                      label: k.label,
                    }))}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            name="value"
            label="Giá trị"
            rules={[{ required: true, message: "Nhập giá trị" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Nút lưu */}
      <div className="flex justify-end mt-8">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={saving}
          onClick={handleSaveProfile}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

// Section hiển thị từng nhóm
const Section = ({
  group,
  attributes,
  onAdd,
  onEdit,
  onDelete,
  onDeleteGroup,
}) => (
  <Card
    className="!rounded-xl !mb-4 !bg-blue-50 !border-0"
    bodyStyle={{ padding: 0, background: "transparent" }}
  >
    <div className="flex items-center justify-between px-6 pt-5 pb-2">
      <Space align="center" size={16}>
        <span className="text-xl" style={{ color: group.color }}>
          {group.icon}
        </span>
        <Title level={5} className="!mb-0 !text-blue-900">
          {group.label}
        </Title>
      </Space>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={onDeleteGroup}
        className="!text-red-400 !font-medium"
        style={{ marginLeft: 8 }}
      >
        Xoá nhóm
      </Button>
    </div>
    <Divider className="!my-2 !bg-blue-200" />
    <div className="px-6 pb-4">
      {!attributes || attributes.length === 0 ? (
        <Button
          type="link"
          icon={<PlusOutlined />}
          className="!text-blue-500 !p-0"
          onClick={onAdd}
        >
          Thêm thông tin
        </Button>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={attributes}
          renderItem={(item, idx) => (
            <List.Item
              className="!bg-transparent"
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(item, idx)}
                  key="edit"
                  className="!text-blue-400"
                />,
                <Button
                  type="text"
                  danger
                  onClick={() => onDelete(idx)}
                  key="delete"
                  className="!text-red-400"
                >
                  Xoá
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className="text-blue-900 font-medium">
                    {group.keys.find((k) => k.key === item.key)?.label ||
                      item.key}
                  </span>
                }
                description={
                  <span className="text-blue-700 text-sm">{item.value}</span>
                }
              />
            </List.Item>
          )}
        />
      )}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        className="mt-2 w-full"
        onClick={onAdd}
        block
      >
        Thêm thông tin
      </Button>
    </div>
  </Card>
);

export default ProfileEditPage;
