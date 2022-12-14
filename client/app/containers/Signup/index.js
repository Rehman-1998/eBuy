/*
 *
 * Signup
 *
 */

import React from "react";

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Redirect, Link } from "react-router-dom";

import actions from "../../actions";

import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Checkbox from "../../components/Common/Checkbox";
import SelectOption from "../../components/Common/SelectOption";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import SignupProvider from "../../components/Common/SignupProvider";

class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      formErrors,
      isLoading,
      isSubmitting,
      isSubscribed,
      signupChange,
      signUp,
      subscribeChange,
    } = this.props;

    if (authenticated) return <Redirect to="/dashboard" />;

    const handleSubmit = (event) => {
      event.preventDefault();
      signUp();
    };

    return (
      <div className="signup-form">
        {isLoading && <LoadingIndicator />}
        <h2>Sign Up</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            {/* <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: "12", order: 1 }}
              className="p-0"
            > */}

            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["firstName"]}
                label={"First Name"}
                name={"firstName"}
                placeholder={"Please Enter Your First Name"}
                value={signupFormData.firstName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["lastName"]}
                label={"Last Name"}
                name={"lastName"}
                placeholder={"Please Enter Your Last Name"}
                value={signupFormData.lastName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["email"]}
                label={"Email Address"}
                name={"email"}
                placeholder={"Please Enter Your Email"}
                value={signupFormData.email}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>

            <Col xs="12" md="6">
              <Input
                type={"password"}
                label={"Password"}
                error={formErrors["password"]}
                name={"password"}
                placeholder={"Please Enter Your Password"}
                value={signupFormData.password}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <SelectOption
                error={formErrors["role"]}
                label={"Select Role"}
                name={"role"}
                options={[
                  { value: "ROLE_MEMBER", label: "Buyer" },
                  { value: "ROLE_MERCHANT", label: "Seller" },
                ]}
                value={signupFormData.role}
                handleSelectChange={(value) => {
                  signupChange("role", value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["phoneNumber"]}
                label={"Phone Number"}
                name={"phoneNumber"}
                placeholder={"Please Enter Your Phone NUmber"}
                value={signupFormData.phoneNumber}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["city"]}
                label={"City"}
                name={"city"}
                placeholder={"Please Enter Your City"}
                value={signupFormData.city}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs="12" md="6">
              <Input
                type={"text"}
                error={formErrors["address"]}
                label={"Address"}
                name={"address"}
                placeholder={"Please Enter Your Address"}
                value={signupFormData.address}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>

            {/* </Col> */}
            <Col
              xs={{ size: 12, order: 1 }}
              md={{ size: "6", order: 2 }}
              className="mb-2 mb-md-0"
            >
              {/* <SignupProvider /> */}
            </Col>
          </Row>
          <hr />
          {/* <Checkbox
            id={"subscribe"}
            label={"Subscribe to newsletter"}
            checked={isSubscribed}
            onChange={subscribeChange}
          /> */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <Button
              type="submit"
              variant="primary"
              text="Sign Up"
              disabled={isSubmitting}
            />
            <Link className="mt-3 mt-md-0 redirect-link" to={"/login"}>
              Back to login
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed,
  };
};

export default connect(mapStateToProps, actions)(Signup);
