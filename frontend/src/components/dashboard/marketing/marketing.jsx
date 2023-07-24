import React, { Component } from "react";
import "./marketing.css";

//React Materiliaze
import { Row, Col, Collapsible, CollapsibleItem } from "react-materialize";

//Victory
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryClipContainer,
  VictoryTheme
} from "victory";

//data

const dataHotMkt = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 7, y: 1 },
  { x: 8, y: 1 },
  { x: 9, y: 1 },
  { x: 10, y: 1 },
  { x: 11, y: 1.5 },
  { x: 12, y: 1.9 }
];

const dataWineMkt = [
  { x: 1, y: 2.2 },
  { x: 2, y: 2.3 },
  { x: 3, y: 2 },
  { x: 4, y: 2.6 },
  { x: 5, y: 2.9 },
  { x: 6, y: 3.3 },
  { x: 7, y: 3 },
  { x: 8, y: 4 },
  { x: 9, y: 4.2 },
  { x: 10, y: 4.7 },
  { x: 11, y: 4.9 },
  { x: 12, y: 5 }
];
const dataLodgeMkt = [
  { x: 1, y: 1.3 },
  { x: 2, y: 1.1 },
  { x: 3, y: 1.2 },
  { x: 4, y: 1.6 },
  { x: 5, y: 2.5 },
  { x: 6, y: 1.7 },
  { x: 7, y: 1.8 },
  { x: 8, y: 2.3 },
  { x: 9, y: 2.4 },
  { x: 10, y: 3 },
  { x: 11, y: 3.3 },
  { x: 12, y: 4 }
];

const dataChanA = [
  { x: 1, y: 5.3 },
  { x: 2, y: 2.1 },
  { x: 3, y: 4.2 },
  { x: 4, y: 3.6 },
  { x: 5, y: 2.5 },
  { x: 6, y: 4.7 },
  { x: 7, y: 5.8 },
  { x: 8, y: 6.3 },
  { x: 9, y: 7.4 },
  { x: 10, y: 7 },
  { x: 11, y: 7.3 },
  { x: 12, y: 8 }
];
const dataChanB = [
  { x: 1, y: 2.4 },
  { x: 2, y: 1.1 },
  { x: 3, y: 3.2 },
  { x: 4, y: 2.6 },
  { x: 5, y: 4.7 },
  { x: 6, y: 5.6 },
  { x: 7, y: 3.3 },
  { x: 8, y: 4.3 },
  { x: 9, y: 5.4 },
  { x: 10, y: 6 },
  { x: 11, y: 6.5 },
  { x: 12, y: 7.2 }
];
const dataChanC = [
  { x: 1, y: 5.4 },
  { x: 2, y: 4.1 },
  { x: 3, y: 5.2 },
  { x: 4, y: 5.6 },
  { x: 5, y: 6.7 },
  { x: 6, y: 6.6 },
  { x: 7, y: 7.3 },
  { x: 8, y: 7.5 },
  { x: 9, y: 7.4 },
  { x: 10, y: 6.9 },
  { x: 11, y: 6.5 },
  { x: 12, y: 7.2 }
];

class Marketing extends Component {
  render() {
    return (
      <div className="marketing">
        <Row>
          <Col s={12}>
            <Collapsible defaultActiveKey={1}>
              <CollapsibleItem header="Growth Segments" icon="insert_chart">
                <VictoryChart
                  theme={VictoryTheme.material}
                  events={[
                    {
                      childName: "all",
                      target: "data",
                      eventHandlers: {
                        onClick: () => {
                          return [
                            {
                              childName: "area-2",
                              target: "data",
                              mutation: props => ({
                                style: Object.assign({}, props.style, {
                                  fill: "gold"
                                })
                              })
                            },
                            {
                              childName: "area-3",
                              target: "data",
                              mutation: props => ({
                                style: Object.assign({}, props.style, {
                                  fill: "orange"
                                })
                              })
                            },
                            {
                              childName: "area-4",
                              target: "data",
                              mutation: props => ({
                                style: Object.assign({}, props.style, {
                                  fill: "red"
                                })
                              })
                            }
                          ];
                        }
                      }
                    }
                  ]}
                >
                  <VictoryLegend
                    x={30}
                    y={5}
                    // title="Bookings"
                    centerTitle
                    orientation="horizontal"
                    gutter={20}
                    style={{
                      border: { stroke: "black" },
                      title: { fontSize: 14 }
                    }}
                    data={[
                      { name: "Hot Springs", symbol: { fill: "orange" } },
                      { name: "Lodge", symbol: { fill: "gold" } }
                    ]}
                  />
                  <VictoryStack>
                    {/* <VictoryArea name="area-1" data={sampleData} /> */}
                    <VictoryArea name="area-2" data={dataWineMkt} />
                    <VictoryArea name="area-3" data={dataLodgeMkt} />
                    <VictoryArea name="area-4" data={dataHotMkt} />
                  </VictoryStack>
                  <VictoryAxis
                    tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                    tickFormat={[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec"
                    ]}
                  />
                </VictoryChart>
              </CollapsibleItem>
              <CollapsibleItem header="Channel Output" icon="show_chart">
                <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
                  <VictoryLine
                    groupComponent={
                      <VictoryClipContainer
                        clipPadding={{ top: 5, right: 10 }}
                      />
                    }
                    style={{
                      data: {
                        stroke: "#c43a31",
                        strokeWidth: 4,
                        strokeLinecap: "round"
                      }
                    }}
                    data={dataChanA}
                  />
                  <VictoryLine
                    groupComponent={
                      <VictoryClipContainer
                        clipPadding={{ top: 5, right: 10 }}
                      />
                    }
                    style={{
                      data: {
                        stroke: "#afafaf",
                        strokeWidth: 4,
                        strokeLinecap: "round"
                      }
                    }}
                    data={dataChanB}
                  />
                  <VictoryLine
                    groupComponent={
                      <VictoryClipContainer
                        clipPadding={{ top: 5, right: 10 }}
                      />
                    }
                    style={{
                      data: {
                        stroke: "#0a6ece",
                        strokeWidth: 4,
                        strokeLinecap: "round"
                      }
                    }}
                    data={dataChanC}
                  />
                  {/* <VictoryBar data={dataChanA} x="investment" y="return" /> */}
                </VictoryChart>
              </CollapsibleItem>
            </Collapsible>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Marketing;
