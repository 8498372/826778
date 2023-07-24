import React, { Component, useEffect, useState  } from "react";
import "./dashboard.css";
import axios from 'axios';

//React Materiliaze
import {
  Row,
  Col,
  Icon,
  Collapsible,
  CollapsibleItem,
  Collection,
  CollectionItem,
  Tab,
  Tabs,
  Modal,
  Table
} from "react-materialize";



//Victory
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryTooltip,
  VictoryLegend,
  VictoryGroup,
  VictoryLine
} from "victory";



//components
import Marketing from "./marketing/marketing";

//images
import Cheers from "../../images/cheers.png";

//data
const dataQuarterly = [
  { quarter: 1, earnings: 12000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const dataMonthly = [
  { month: 1, earnings: 2000 },
  { month: 2, earnings: 6500 },
  { month: 3, earnings: 4250 },
  { month: 4, earnings: 3000 },
  { month: 5, earnings: 2500 },
  { month: 6, earnings: 1800 },
  { month: 7, earnings: 2200 },
  { month: 8, earnings: 2700 },
  { month: 9, earnings: 1900 },
  { month: 10, earnings: 3300 },
  { month: 11, earnings: 5400 },
  { month: 12, earnings: 8000 }
];

const dataPieChart = [
  { x: 1, y: 3.8, label: "Winery 38%" },
  { x: 2, y: 1.8, label: "Lodge 18%" },
  { x: 3, y: 4.4, label: "Hot Springs 44%" }
];
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_amv_col: [],
      data_amv_bfa: [],
      data_dme_col: [],
      data_dme_bfa: [],
      data_vmb_col: [],
      data_vmb_bfa: [],
      loading: true,
    };
  }


  componentDidMount() {
    // Define the API endpoints for both services
    const apiUrlA = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/amv?c_id=COL';
    const apiUrlB = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/amv?c_id=BFA';
    const apiUrlDmeCol = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/dne?c_id=COL';
    const apiUrlDmeBfa = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/dne?c_id=BFA';
    const apiUrlVmbCol = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/vmb?c_id=COL';
    const apiUrlVmbBfa = 'https://deejig5et0.execute-api.eu-south-1.amazonaws.com/DEV/vmb?c_id=BFA';

    // Fetch data from both services simultaneously using Promise.all()
    Promise.all([axios.get(apiUrlA), axios.get(apiUrlB),axios.get(apiUrlDmeCol), axios.get(apiUrlDmeBfa),axios.get(apiUrlVmbCol), axios.get(apiUrlVmbBfa)])
      .then(([responseA, responseB,responseDmeCol, responseDmeBfa,responseVmbCol, responseVmbBfa]) => {
        // Update the component state with the fetched data
        this.setState({
          data_amv_col: responseA.data,
          data_amv_bfa: responseB.data,
          data_dme_col: responseDmeCol.data,
          data_dme_bfa: responseDmeBfa.data,
          data_vmb_col: responseVmbCol.data,
          data_vmb_bfa: responseVmbBfa.data,
          loading: false, // Set loading to false once data is fetched
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false }); // Set loading to false if an error occurs
      });
  }

  render() {

  const { data_amv_col, data_amv_bfa,data_dme_col, data_dme_bfa,data_vmb_col, data_vmb_bfa, loading } = this.state;

  if (loading) {
    return <div>Loading...</div>;
  }

  const regions_m1 = [...new Set([...data_amv_col, ...data_amv_bfa].map((item) => item.region_name))];
  const months_m1 = [...new Set([...data_amv_col, ...data_amv_bfa].map((item) => item.month))];
  const day_m2 = [...new Set([...data_dme_col, ...data_dme_bfa].map((item) => item.date))];
  const day_col_m3 = [...new Set([...data_vmb_col].map((item) => item.date))];
  const day_bfa_m3 = [...new Set([...data_vmb_bfa].map((item) => item.date))];
   return (
      <div className="dashboard">
        <Row>

          <Col s={12} m={12}>
            <Col s={12}>
              <div className="tabChartContainer">
                <div className="tabChartHeader">
                  <span>Task 2</span>
                </div>
                <Tabs className="tabStyle">
                <Tab active title="Variance metric B">
                    <Col s={12} l={12}>
                      <div className="activityCard">
                      <VictoryChart domainPadding={20} height={300}>
                        <VictoryAxis tickValues={day_col_m3} tickFormat={(day) => day.split('-')[2]} />
                        <VictoryAxis dependentAxis />
                        <VictoryGroup offset={20}>
                          <VictoryLine
                            data={data_vmb_col}
                            x="date"
                            y="average_prevalence"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#8884d8' },
                            }}
                          />
                          <VictoryLine
                            data={data_vmb_col}
                            x="date"
                            y="prevalence_variance"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#82ca9d' },
                            }}
                          />
                        </VictoryGroup>
                        <VictoryLegend
                          x={100}
                          y={10}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            { name: 'COL AVG Prevalence', symbol: { fill: '#8884d8' } },
                            { name: 'COL Variance Prevalence', symbol: { fill: '#82ca9d' } },
                          ]}
                        />
                      </VictoryChart>
                      <VictoryChart domainPadding={20} height={300}>
                        <VictoryAxis tickValues={day_bfa_m3} tickFormat={(day) => day.split('-')[2]} />
                        <VictoryAxis dependentAxis />
                        <VictoryGroup offset={20}>
                          <VictoryLine
                            data={data_vmb_bfa}
                            x="date"
                            y="average_prevalence"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#8884d8' },
                            }}
                          />
                          <VictoryLine
                            data={data_vmb_bfa}
                            x="date"
                            y="prevalence_variance"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#82ca9d' },
                            }}
                          />
                        </VictoryGroup>
                        <VictoryLegend
                          x={100}
                          y={10}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            { name: 'BFA AVG Prevalence', symbol: { fill: '#8884d8' } },
                            { name: 'BFA Variance Prevalence', symbol: { fill: '#82ca9d' } },
                          ]}
                        />
                      </VictoryChart>
                      </div>
                    </Col>
                  </Tab>
                  <Tab title="Metric A">
                    <Col s={12}>
                      <div className="activityCard">
                      <VictoryChart domainPadding={20} height={300}>
                        <VictoryAxis tickValues={months_m1} tickFormat={(month) => month.split('-')[1]} />
                        <VictoryAxis dependentAxis />
                        <VictoryGroup offset={20}>
                          <VictoryBar
                            data={data_amv_col}
                            x="month"
                            y="avg_fcs"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#8884d8' },
                            }}
                          />
                          <VictoryBar
                            data={data_amv_bfa}
                            x="month"
                            y="avg_fcs"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#82ca9d' },
                            }}
                          />
                        </VictoryGroup>
                        <VictoryLegend
                          x={100}
                          y={10}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            { name: 'COL AVG FCS', symbol: { fill: '#8884d8' } },
                            { name: 'BFA AVG FCS', symbol: { fill: '#82ca9d' } },
                          ]}
                        />
                      </VictoryChart>
                      </div>
                    </Col>
                  </Tab>
                  <Tab title="Metric B">
                    <Col s={12} l={12}>
                      <div className="activityCardGreen">
                      <VictoryChart domainPadding={20} height={300}>
                        <VictoryAxis tickValues={day_m2} tickFormat={(day) => day.split('-')[2]} />
                        <VictoryAxis dependentAxis />
                        <VictoryGroup offset={20}>
                          <VictoryLine
                            data={data_dme_col}
                            x="date"
                            y="average_prevalence"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#8884d8' },
                            }}
                          />
                          <VictoryLine
                            data={data_dme_bfa}
                            x="date"
                            y="average_prevalence"
                            labels={({ datum }) => `${datum}`}
                            labelComponent={<VictoryTooltip />}
                            style={{
                              data: { fill: '#82ca9d' },
                            }}
                          />
                        </VictoryGroup>
                        <VictoryLegend
                          x={100}
                          y={10}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            { name: 'COL AVG Prevalence', symbol: { fill: '#8884d8' } },
                            { name: 'BFA AVG Prevalence', symbol: { fill: '#82ca9d' } },
                          ]}
                        />
                      </VictoryChart>
                      </div>
                    </Col>
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
