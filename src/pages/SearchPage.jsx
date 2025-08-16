import { useState, useEffect } from "react";
import { Input, List, Typography, Row, Col, Card, Button } from "antd";
import styled from "styled-components";
import debounce from "lodash.debounce";
import UserCard from "../components/UserCard";
import useProfileNavigate from "../hooks/useProfileNavigate";
import { useFetchUser } from "../hooks/useFetchUser";

const { Text } = Typography;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled(Row)`
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SearchPage = () => {
  const [queryString, setQueryString] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, hasNext, setQuery, fetchNext] = useFetchUser();

  const navigate = useProfileNavigate();

  const handleSearch = debounce(async (val) => {
    if (!val) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setQuery(val);
    setLoading(false);
  }, 400);

  useEffect(() => {
    handleSearch(queryString);
    return () => handleSearch.cancel();
  }, [queryString]);

  return (
    <SearchContainer>
      <Header justify="space-between" align="middle">
        <Col>
          <Text strong style={{ fontSize: 20 }}>
            Tìm kiếm người dùng
          </Text>
        </Col>
      </Header>
      <div className="bg-white p-4">
        <Input
          placeholder="Nhập username hoặc họ tên..."
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          size="medium"
          allowClear
          className="mb-2"
        />
      </div>
      {users.length === 0 && queryString && !loading ? (
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 20 }}
        >
          Không tìm thấy người dùng phù hợp
        </Text>
      ) : (
        <List
          loading={loading}
          dataSource={users}
          renderItem={(user) => (
            <UserCard
              onClick={() => navigate(user._id)}
              key={user._id}
              avatar={
                user.profile?.avatar ||
                `https://i.pravatar.cc/150?u=${user._id}`
              }
              username={user.username}
              fullname={user.fullName}
            />
          )}
          loadMore={
            hasNext ? (
              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <Button onClick={fetchNext} type="default">
                  Tải thêm
                </Button>
              </div>
            ) : (
              <div className="text-center text-xs text-gray-400">
                không có thêm kết quả
              </div>
            )
          }
          style={{ marginTop: 12 }}
        />
      )}
    </SearchContainer>
  );
};

export default SearchPage;
