import React, { useEffect, useState } from "react";
import Loading from "../Pages/Loading";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/data/users.json").then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setVisibleUsers(data.slice(0, 5));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleUsers(users.slice(0, visibleCount));
  }, [visibleCount, users]);

  const handleLoadMore = () => {
    if (visibleCount < users.length) {
      setVisibleCount((prev) => prev + 5);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-heading">Users List</h2>
      {loading? (
        <div className="loader-container"><Loading /></div>
      ): (
        <div className="users-grid">
          {visibleUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-name">
                <span  onClick={() => navigate(`/user/${user.id}`)}>{user.name}</span>
              </div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Company:</strong> {user.company_name}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && visibleCount < users.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
