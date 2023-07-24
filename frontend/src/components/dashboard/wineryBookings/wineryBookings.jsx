import React, { Component } from "react";
import "./wineryBookings.css";

//React Materiliaze
import { Row, Col } from "react-materialize";

//Victory
import {
  VictoryChart,
  VictoryTheme,
  VictoryLegend,
  VictoryScatter
} from "victory";

//data

// const dataWineBookings = [
//   { x: 1, y: 1 },
//   { x: 2, y: 1 },
//   { x: 3, y: 1 },
//   { x: 4, y: 1 },
//   { x: 5, y: 1 },
//   { x: 6, y: 1 },
//   { x: 7, y: 1 },
//   { x: 8, y: 1 }
// ];

class WineryBookings extends Component {
  render() {
    return (
      <div className="wineryBookings">
        <Row>
          <Col s={12}>
            <VictoryChart
              domain={{ y: [0, 1] }}
              domainPadding={{ y: 100 }}
              animate={{ duration: 3000 }}
              theme={VictoryTheme.material}
              height={300}
            >
              <VictoryLegend
                x={70}
                y={5}
                // title="Bookings"
                centerTitle
                orientation="horizontal"
                gutter={20}
                style={{ border: { stroke: "black" }, title: { fontSize: 14 } }}
                data={[
                  { name: "Winery", symbol: { fill: "tomato" } },
                  { name: "Hot Springs", symbol: { fill: "orange" } },
                  { name: "Lodge", symbol: { fill: "gold" } }
                ]}
              />
              <VictoryScatter
                size={5}
                data={this.state.data}
                style={{
                  data: { opacity: d => d.opacity || 1, fill: "#tomato" }
                }}
                animate={{
                  onExit: {
                    duration: 500,
                    before: () => ({ opacity: 0.3, _y: 0 })
                  },
                  onEnter: {
                    duration: 500,
                    before: () => ({ opacity: 0.3, _y: 0 }),
                    after: datum => ({ opacity: 1, _y: datum._y })
                  }
                }}
              />
            </VictoryChart>
          </Col>
        </Row>
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = { data: this.getData() };
  }

  componentDidMount() {
    this.setStateInterval = window.setInterval(() => {
      this.setState({ data: this.getData() });
    }, 3000);
  }

  componentWillUnmount() {
    window.clearInterval(this.setStateInterval);
  }

  getData() {
    const num = Math.floor(10 * Math.random() + 5);
    const points = new Array(num).fill(1);
    return points.map((point, index) => {
      return { x: index + 1, y: Math.random() };
    });
  }
}

export default WineryBookings;
