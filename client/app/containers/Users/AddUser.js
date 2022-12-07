/*
 *
 * Signup
 *
 */

import React, { useState } from "react";

import { connect, useDispatch } from "react-redux";
import { Row, Col } from "reactstrap";
import { Redirect, Link, useLocation } from "react-router-dom";

import actions from "../../actions";
import { addUser, updateUser, deleteUser } from "./actions";

import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/Checkbox";
import SelectOption from "../../components/Common/SelectOption";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import SignupProvider from "../../components/Common/SignupProvider";

const AddUser = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("Location====>", location?.state);
  const [editTable, setEditTable] = useState(
    location?.state?.editTable === true ? true : false
  );
  const [userData, setUserData] = useState({
    _id: "" || location?.state?.user._id,
    firstName: "" || location?.state?.user.firstName,
    lastName: "" || location?.state?.user.lastName,
    email: "" || location?.state?.user.email,
    role: "" || location?.state?.user.role,
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addUser(userData));
  };

  return (
    <div className="signup-form">
      {/* {isLoading && <LoadingIndicator />} */}
      <h2>{editTable === false ? "Add User" : "Edit User"}</h2>
      <hr />
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col
            xs={{ size: 12, order: 2 }}
            md={{ size: "6", order: 1 }}
            className="p-0"
          >
            <Col xs="12" md="12">
              <Input
                type={"text"}
                // error={formErrors["email"]}
                label={"Email Address"}
                name={"email"}
                placeholder={"Please Enter Your Email"}
                value={userData.email}
                onInputChange={(name, value) => {
                  setUserData((pre) => ({ ...pre, [name]: value }));
                }}
              />
            </Col>
            <Col xs="12" md="12">
              <Input
                type={"text"}
                // // error={formErrors["firstName"]}
                label={"First Name"}
                name={"firstName"}
                placeholder={"Please Enter Your First Name"}
                value={userData.firstName}
                onInputChange={(name, value) => {
                  setUserData((pre) => ({ ...pre, [name]: value }));
                }}
              />
            </Col>
            <Col xs="12" md="12">
              <Input
                type={"text"}
                // // error={formErrors["lastName"]}
                label={"Last Name"}
                name={"lastName"}
                placeholder={"Please Enter Your Last Name"}
                value={userData.lastName}
                onInputChange={(name, value) => {
                  setUserData((pre) => ({ ...pre, [name]: value }));
                }}
              />
            </Col>
            <Col xs="12" md="12">
              {editTable === false ? (
                <SelectOption
                  // // error={formErrors["role"]}
                  label={"Select Role"}
                  name={"role"}
                  options={[
                    { value: "ROLE_MEMBER", label: "Buyer" },
                    { value: "ROLE_MERCHANT", label: "Seller" },
                  ]}
                  value={userData.role}
                  handleSelectChange={(value) => {
                    setUserData((pre) => ({ ...pre, role: value }));
                  }}
                />
              ) : (
                <Input
                  type={"text"}
                  // // error={formErrors["lastName"]}
                  label={"Role"}
                  name={"role"}
                  placeholder={"Select Role"}
                  disabled={true}
                  value={userData.role}
                  onInputChange={(name, value) => {
                    setUserData((pre) => ({ ...pre, [name]: value }));
                  }}
                />
              )}
            </Col>
            {editTable === false ? (
              <Col xs="12" md="12">
                <Input
                  type={"password"}
                  label={"Password"}
                  // // error={formErrors["password"]}
                  name={"password"}
                  placeholder={"Please Enter Your Password"}
                  value={userData.password}
                  onInputChange={(name, value) => {
                    setUserData((pre) => ({ ...pre, [name]: value }));
                  }}
                />
              </Col>
            ) : null}
          </Col>
          <Col
            xs={{ size: 12, order: 1 }}
            md={{ size: "6", order: 2 }}
            className="mb-2 mb-md-0"
          >
            {/* <SignupProvider /> */}
          </Col>
        </Row>
        {/* <hr />
          <Checkbox
            id={"subscribe"}
            label={"Subscribe to newsletter"}
            checked={isSubscribed}
            onChange={subscribeChange}
          /> */}

        {editTable === false ? (
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <Button
              type="submit"
              variant="primary"
              text="Add User"
              // disabled={isSubmitting}
            />
          </div>
        ) : (
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-start">
            <Button
              text="Save User"
              onClick={() => dispatch(updateUser(userData))}
            />
            <div style={{ marginLeft: "10px" }}>
              <Button
                variant="danger"
                text="Delete User"
                onClick={() => dispatch(deleteUser(userData))}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddUser;
