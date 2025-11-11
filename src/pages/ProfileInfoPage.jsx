import React, { use, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../redux/profile.slice";

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

// Chỉ xem được, không chỉnh sửa
const ProfileInfoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    dispatch(getCurrentUser({ id }));
  }, [dispatch, id]);

  // Danh sách các group đã chọn để hiển thị
  const [activeGroups, setActiveGroups] = useState([]);
  // Dữ liệu các thuộc tính từng group
  const [attributes, setAttributes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [editingAttr, setEditingAttr] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);

  // State cho form modal
  const [form] = Form.useForm();

  // Binding lại attributes từ user.introduction (dạng [{key, value, group}]) thành object { group: [ {key, value, group}, ... ] }
  useEffect(() => {
    const intro = user?.introduction || [];
    const grouped = {};
    intro.forEach((item) => {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    });

    setAttributes(grouped);
  }, [user]);

  // Danh sách các group đã chọn để hiển thị (từ introduction)
  useEffect(() => {
    setActiveGroups(Object.keys(attributes));
  }, [attributes]);

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

  return (
    <div className="max-w-xl mx-auto flex flex-col py-6 px-2 bg-white min-h-screen text-[#222]">
      <div className="text-lg font-semibold mb-4">Thông tin cơ bản</div>
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
                src={user?.profile?.avatar}
                icon={<UserOutlined />}
                style={{ border: "2px solid #1890ff", background: "#fff" }}
              />
            </div>
          </Col>
          <Col flex="auto">
            <Input
              value={
                user?.profile?.displayName ||
                user?.fullName ||
                user?.username ||
                ""
              }
              maxLength={50}
              className="!text-xl !font-bold !bg-white !border-0 !shadow-none !py-1 !text-blue-900"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#1d3557",
                background: "transparent",
              }}
              bordered={false}
              disabled
            />
            <div className="mt-2">
              <Input.TextArea
                value={user?.profile?.bio || ""}
                maxLength={200}
                rows={2}
                className="!bg-white !border !border-blue-100 !rounded"
                style={{ resize: "none" }}
                disabled
              />
            </div>
            <div className="mt-2">
              <Radio.Group
                options={genderOptions}
                value={user?.profile?.gender || "other"}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </Col>
        </Row>
      </Card>

      <div className="text-lg font-semibold mb-4">Thông tin giới thiệu</div>

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
    </div>
  );
};

// Section hiển thị từng nhóm
const Section = ({ group, attributes, onAdd }) => (
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
          renderItem={(item) => (
            <List.Item className="!bg-transparent">
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
    </div>
  </Card>
);

export default ProfileInfoPage;
