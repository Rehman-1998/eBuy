/**
 *
 * UserList
 *
 */

import React from "react";

import { formatDate } from "../../../utils/date";
import UserRole from "../UserRole";
import { useHistory } from "react-router-dom";

const UserList = (props) => {
  const history = useHistory();
  const { users } = props;
  console.log("User Data===>", users);

  return (
    <div className="u-list">
      {users.map((user, index) => (
        <div
          onClick={() =>
            history.push({
              pathname: "/dashboard/users/add",
              state: { user, editTable: true },
            })
          }
          key={index}
          className="mt-3 px-4 py-3 user-box"
        >
          <label className="text-black">Name</label>
          <p className="fw-2">
            {user?.firstName ? `${user?.firstName} ${user?.lastName}` : "N/A"}
          </p>
          <label className="text-black">Email</label>
          <p>{user?.email}</p>
          <label className="text-black">Provider</label>
          <p>{user?.provider}</p>
          <label className="text-black">Account Created</label>
          <p>{formatDate(user?.created)}</p>
          <label className="text-black">Role</label>
          <p className="mb-0">
            <UserRole user={user} className="d-inline-block mt-2" />
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
