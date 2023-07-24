import React, { Component } from "react";
import "./header.css";

//React Materiliaze
import { Row, Col, Icon } from "react-materialize";

//images

class Header extends Component {
  render() {
    return (
      <div className="header">
        <Row>
          <Col s={12}>
            <h2 className="logoFont">
              <Icon medium className="iconVert">
                language
              </Icon>
              826778 Lead Software engineer - Candidate: 8498372
              {/* <span> CuddleStone Winery & Hot Springs</span> */}
            </h2>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
