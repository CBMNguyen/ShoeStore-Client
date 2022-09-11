import React from "react";
import { Col, Progress, Row } from "reactstrap";
import { getStarNumbers } from "utils/common";

function ReviewProgressItem({ starNumber, reviews }) {
  return (
    <Row>
      <Col className="col-auto">
        <div style={{ width: "180px" }}>
          {Array.from(Array(starNumber).keys()).map((key) => (
            <i key={key} className="bx bxs-star fs-4 text-warning"></i>
          ))}
        </div>
      </Col>

      <Col lg={5}>
        <Progress
          className="mt-2"
          color="secondary"
          style={{
            height: "4px",
          }}
          value={getStarNumbers(starNumber, reviews)}
        />
      </Col>
      <Col>
        <code style={{ position: "relative", top: "-4px" }}>
          {getStarNumbers(starNumber, reviews)}
        </code>
      </Col>
    </Row>
  );
}

export default ReviewProgressItem;
