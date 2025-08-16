import { useEffect, useState } from "react";
import { searchUsersAPI } from "../services/user.service";
import { message } from "antd";

export const useFetchUser = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!result) return;

    setHasNext(result.hasNextPage);
  }, [result]);

  const fetchUsers = async () => {
    try {
      const response = await searchUsersAPI(query);

      setResult(response.pagination);
      setUsers(response.users);
    } catch (error) {
      message.error(error);
      setResult(null);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (!query) return;
    fetchUsers();
  }, [query]);

  const fetchNext = async () => {
    try {
      if (!result?.hasNextPage) return;

      const response = await searchUsersAPI(query, result?.page + 1);

      setResult(response.pagination);
      setUsers([...users, ...response.users]);
    } catch (error) {
      message.error(error);
      setResult(null);
      setUsers([]);
    }
  };

  return [users, hasNext, setQuery, fetchNext];
};
