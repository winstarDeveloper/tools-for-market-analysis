import React, { Component } from "react";
import { Form, Alert, Table } from "react-bootstrap";
import Select from "react-select";
import { CommonLoading, BoxLoading } from "react-loadingg";
import Chart from "chart.js";

import * as NseURL from "../../../app/utils/NSE_Urls";

class NiftyWeightage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      chartRendered: false,
      message: "",
      indicesList: [
        "NIFTY 50",
        "NIFTY 500",
        "NIFTY NEXT 50",
        "NIFTY MIDCAP 50",
        "NIFTY MIDCAP 150",
        "NIFTY SMALLCAP 50",
        "NIFTY SMALLCAP 250",
        "NIFTY MIDSMALLCAP 400",
        "NIFTY 100",
        "NIFTY 200",
        "NIFTY AUTO",
        "NIFTY BANK",
        "NIFTY ENERGY",
        "NIFTY FINANCIAL SERVICES",
        "NIFTY FMCG",
        "NIFTY IT",
        "NIFTY MEDIA",
        "NIFTY METAL",
        "NIFTY PHARMA",
        "NIFTY PSU BANK",
        "NIFTY REALTY",
        "NIFTY PRIVATE BANK",
        "NIFTY COMMODITIES",
        "NIFTY INDIA CONSUMPTION",
        "NIFTY CPSE",
        "NIFTY INFRASTRUCTURE",
        "NIFTY MNC",
        "NIFTY GROWTH SECTORS 15",
        "NIFTY PSE",
        "NIFTY SERVICES SECTOR",
        "NIFTY100 LIQUID 15",
        "NIFTY MIDCAP LIQUID 15",
        "NIFTY DIVIDEND OPPORTUNITIES 50",
        "NIFTY50 VALUE 20",
        "NIFTY100 QUALITY 30",
        "NIFTY50 EQUAL WEIGHT",
        "NIFTY100 EQUAL WEIGHT",
        "NIFTY100 LOW VOLATILITY 30",
        "NIFTY ALPHA 50",
        "NIFTY200 QUALITY 30",
      ],
      selectedIndex: "",
      stockList: [],
      marketCapList: [],
      totalMarketCap: 0.0,
      disableIndexSelect: false,
    };
    this.getIndexData = this.getIndexData.bind(this);
    this.getMarketCap = this.getMarketCap.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.getStockMarketCaps = this.getStockMarketCaps.bind(this);
  }

  async getIndexData(indexName) {
    try {
      const index_data_url =
        NseURL.Nse_main_URL + NseURL.IndexDataURL + indexName;

      const response = await fetch(index_data_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          stockList: Data.data
            .filter((i, idx) => idx !== 0)
            .map((j) => j.symbol),
          timestamp: Data.timestamp,
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          stockList: [],
        });
      }
      // console.log("Stock List: ", this.state.stockList);
    } catch (err) {
      this.setState({
        message: "Error Retrieving Data - Retrying ",
        stockList: [],
      });
      console.log("Error: ", err.message);
    }
  }

  async getMarketCap(stockName) {
    try {
      const quote_data_url =
        NseURL.Nse_main_URL_2 + NseURL.QuoteInfoURL + stockName;

      const response = await fetch(quote_data_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          marketCapList: [
            ...this.state.marketCapList,
            {
              symbol: stockName,
              marketCap: Data.marketDeptOrderBook
                ? Data.marketDeptOrderBook.tradeInfo.totalMarketCap
                : 0,
              weightage: 0,
            },
          ],
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          marketCapList: [],
        });
      }
      // console.log("Market Cap: ", this.state.marketCapList);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  async componentDidMount() {
    await this.setState({ loading: false });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getStockMarketCaps() {
    // for (let i = 0; i < this.state.stockList.length; i++) {
    //   await this.getMarketCap(this.state.stockList[i]);
    // }

    let stockList = this.state.stockList;
    let mktCapList = [];
    let msg = "";
    await Promise.all(
      this.state.stockList.map((stockName) => {
        return fetch(NseURL.Nse_main_URL_2 + NseURL.QuoteInfoURL + stockName);
      })
    )
      .then(function(responses) {
        return Promise.all(
          responses.map(function(response) {
            return response.json();
          })
        );
      })
      .then(function(data) {
        data.forEach((Data, idx) => {
          mktCapList = [
            ...mktCapList,
            {
              symbol: stockList[idx],
              marketCap: Data.marketDeptOrderBook
                ? Data.marketDeptOrderBook.tradeInfo.totalMarketCap
                : 0,
              weightage: 0,
            },
          ];
        });
        // console.log("All Data: ", mktCapList);
      })
      .catch(function(error) {
        console.log("Error All: ", error);
        msg = "Error Retrieving Data - Retrying ";
      });

    mktCapList.length === 0
      ? this.setState({ message: "Error CORS Issue - Retrying ", marketCapList: [] })
      : this.setState({ message: msg, marketCapList: mktCapList });
  }

  getTotalMarketCap = () => {
    let total = 0;
    this.state.marketCapList.map((i) => (total += i.marketCap));
    this.setState({ totalMarketCap: total });
    // console.log("Total: ", total);
  };

  getWeightage = () => {
    this.setState({
      marketCapList: this.state.marketCapList.map((i) => ({
        symbol: i.symbol,
        marketCap: i.marketCap,
        weightage: (i.marketCap * 100) / this.state.totalMarketCap,
      })),
    });
    // console.log("Got Weightage");
  };

  getTotalWeightage = () => {
    let w = 0;
    this.state.marketCapList.map((i) => (w += i.weightage));
    // console.log("Percentage: ", w);
  };

  sortByWeightage = (a, b) => {
    let comparison = 0;
    if (a.weightage < b.weightage) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  get_random_color = () => {
    function c() {
      var hex = Math.floor(Math.random() * 256).toString(16);
      return ("0" + String(hex)).substr(-2); // pad with zero
    }
    return "#" + c() + c() + c();
  };

  renderChart = () => {
    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: [...this.state.marketCapList.map((i) => i.symbol)],
        datasets: [
          {
            label: "NIFTY Weightage",
            data: [
              ...this.state.marketCapList.map((i) => i.weightage.toFixed(2)),
            ],
            backgroundColor: [
              ...this.state.marketCapList.map(
                (i) =>
                  "#" + (Math.random().toString(16) + "000000").substring(2, 8)
              ),
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  setUpdateInterval = (time, value) => {
    clearInterval(this.interval);
    this.interval = setInterval(
      () => this.handleChangeIndex(value),
      time * 1000
    );
  };

  async handleChangeIndex(value) {
    if (value) {
      await this.setState({
        selectedIndex: "",
      });
      await this.setState({
        selectedIndex: value.label,
        chartRendered: false,
        stockList: [],
        marketCapList: [],
        totalMarketCap: 0.0,
        disableIndexSelect: true,
      });
      await this.getIndexData(value.label);
      await this.getStockMarketCaps();

      if (this.state.message.length !== 0) {
        this.setUpdateInterval(3, value);
        return;
      }else{
        clearInterval(this.interval);
      }

      await this.getTotalMarketCap();
      await this.getWeightage();
      await this.renderChart();
      await this.setState({
        chartRendered: true,
        disableIndexSelect: false,
      });
    } else {
      await this.setState({
        selectedIndex: "",
        chartRendered: false,
        stockList: [],
        marketCapList: [],
        totalMarketCap: 0.0,
        disableIndexSelect: false,
      });
    }
  }

  render() {
    return !this.state.loading ? (
      <div className="niftyweightage">
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message}
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Alert>
        ) : null}

        <div className="row d-flex justify-content-center">
          <Form.Group>
            <Form.Label>Select Index:</Form.Label>
            <Select
              className="niftyweightage__select-index"
              inputId="select_index"
              TextFieldProps={{
                label: "Select Index: ",
                InputLabelProps: {
                  htmlFor: "select_index",
                  shrink: true,
                },
                placeholder: "Select Index",
              }}
              options={[
                ...this.state.indicesList.map((i) => {
                  return {
                    label: i,
                  };
                }),
              ]}
              isClearable={true}
              onChange={this.handleChangeIndex}
              isDisabled={this.state.disableIndexSelect}
            />
          </Form.Group>
        </div>

        {this.state.selectedIndex !== "" && this.state.timestamp !== "" ? (
          <div className="row d-flex justify-content-center">
            <p className="text-muted oivolume__contract-timestamp">
              Last Updated - {this.state.timestamp}
            </p>
          </div>
        ) : null}

        {this.state.selectedIndex !== "" ? (
          <div className="row">
            <div className="col-lg-4">
              <Table
                striped
                bordered
                hover
                className="niftyweightage__table bg-light"
              >
                <thead>
                  <tr className="bg-light-dark niftyweightage__table-heading">
                    <th className="text-center">SYMBOL</th>
                    <th className="text-center">Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.marketCapList
                    .sort(this.sortByWeightage)
                    .map((i, index) => {
                      return (
                        <tr key={index} className="niftyweightage__table-data">
                          <td className="h3">{i.symbol}</td>
                          <td className="h3 text-center">
                            {i.weightage.toFixed(2)} %
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
            {this.state.chartRendered ? null : <CommonLoading />}
            <div className="col-lg-8 niftyweightage__visual">
              <canvas id="myChart" width="100vw" height="70vh"></canvas>
            </div>
          </div>
        ) : null}
      </div>
    ) : (
      <>
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message}
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Alert>
        ) : null}
        <BoxLoading />
      </>
    );
  }
}

export default NiftyWeightage;
