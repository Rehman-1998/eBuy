import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import { useDispatch } from "react-redux";
import { addBid } from "./actions";

const Bid = ({ product, user }) => {
  const dispatch = useDispatch();
  const [bidData, setBidData] = useState({
    merchant: product.merchant,
    product: product._id,
    user: user._id,
    actualPrice: product.price,
    bidQuantity: "",
    bidPrice: "",
    status: "Waiting Approval",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("IN BID Componenet=====>", bidData);
    dispatch(addBid(bidData));
  };
  return (
    <>
      <Row>
        <Col md={6}>
          <Input
            type={"number"}
            // error={shopFormErrors["quantity"]}
            label={"Your Price"}
            name={"bidPrice"}
            decimals={false}
            placeholder={"Enter your desire Price"}
            value={bidData.bidPrice}
            onInputChange={(name, value) => {
              setBidData((prevValue) => ({ ...prevValue, [name]: value }));
            }}
          />
        </Col>
        <Col md={6}>
          <Input
            type={"number"}
            // error={shopFormErrors["quantity"]}
            label={"Your Quantity"}
            name={"bidQuantity"}
            decimals={false}
            placeholder={"Enter your desire Quantity"}
            value={bidData.bidQuantity}
            onInputChange={(name, value) => {
              setBidData((prevValue) => ({ ...prevValue, [name]: value }));
            }}
          />
        </Col>
        <Col md={4}>
          <Button
            variant="primary"
            text="Submit Porposal"
            className="bag-btn"
            // icon={<BagIcon />}
            onClick={handleSubmit}
          />
        </Col>
      </Row>
    </>
  );
};

export default Bid;
