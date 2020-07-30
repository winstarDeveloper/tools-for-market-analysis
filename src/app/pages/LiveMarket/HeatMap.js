import React, { Component } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { BoxLoading, CommonLoading } from "react-loadingg";
import * as NseURL from "../../../app/utils/NSE_Urls";

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingIndex: false,
      indexName: "",
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
      sortByOptions: ["High to LTP", "Open to LTP", "Low to LTP"],
      isSort: true,
      indexData: [],
      sortData: [],
      timestamp: "",
      maxUp: true,
    };
    this.getIndicesList = this.getIndicesList.bind(this);
    this.getIndexData = this.getIndexData.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
  }

  async getIndicesList() {
    try {
      const indices_url = NseURL.Nse_main_URL + NseURL.IndicesListURL;

      const response = await fetch(indices_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          indicesList: Data,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          indicesList: {},
        });
      }
      console.log("Indices List: ", this.state.indicesList);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getIndexData(indexName) {
    try {
      const index_data_url =
        NseURL.Nse_main_URL + NseURL.IndexDataURL + indexName;

      const response = await fetch(index_data_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          indexData: Data.data,
          timestamp: Data.timestamp,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          indexData: [],
        });
      }
      console.log("Index Data: ", this.state.indexData);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async updateData() {
    if (!this.state.loading && this.state.indexName !== "") {
      await this.getIndexData(this.state.indexName);
      this.setData();
    }
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    // this.getIndicesList();
    // this.getIndexData("NIFTY 50");
    await this.setState({ loading: false });
    this.interval = setInterval(() => this.updateData(), 25000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleMaxUp = () => {
    if (this.state.maxUp) {
      this.setState({ maxUp: false });
    } else {
      this.setState({ maxUp: true });
    }
    this.updateData();
  };

  sortByPChange = (a, b) => {
    let comparison = 0;
    if (this.state.maxUp) {
      if (a.pchange > b.pchange) {
        comparison = -1;
      } else {
        comparison = 1;
      }
    } else {
      if (a.pchange > b.pchange) {
        comparison = 1;
      } else {
        comparison = -1;
      }
    }
    return comparison;
  };

  sortByPriority = (a, b) => {
    let comparison = 0;
    if (a.priority > b.priority) {
      comparison = -1;
    } else {
      comparison = 1;
    }
    return comparison;
  };

  setData = () => {
    console.log("setdata");
    this.setState({
      sortData: this.state.indexData
        .map((i) => {
          if (this.state.sortBy === "Open to LTP") {
            return {
              symbol: i.symbol,
              priority: i.priority,
              open: i.open,
              high: i.dayHigh,
              low: i.dayLow,
              close: i.previousClose,
              currentPrice: i.lastPrice,
              pchange: ((i.lastPrice - i.open) * 100) / i.open,
            };
          } else if (this.state.sortBy === "Low to LTP") {
            return {
              symbol: i.symbol,
              priority: i.priority,
              open: i.open,
              high: i.dayHigh,
              low: i.dayLow,
              close: i.previousClose,
              currentPrice: i.lastPrice,
              pchange: ((i.lastPrice - i.dayLow) * 100) / i.dayLow,
            };
          } else {
            return {
              symbol: i.symbol,
              priority: i.priority,
              open: i.open,
              high: i.dayHigh,
              low: i.dayLow,
              close: i.previousClose,
              currentPrice: i.lastPrice,
              pchange: ((i.lastPrice - i.dayHigh) * 100) / i.dayHigh,
            };
          }
        })
        .sort(this.sortByPChange)
        .sort(this.sortByPriority),
    });
    console.log("sortData: ", this.state.sortData);
  };

  async handleChangeIndex(value) {
    if (value) {
      await this.setState({ loadingIndex: true, indexName: value.label });
      await this.getIndexData(value.label);
      this.setData();
      await this.setState({ loadingIndex: false, isSort: false });
    } else {
      await this.setState({
        loadingIndex: false,
        indexName: "",
        sortData: [],
        isSort: true,
      });
    }
  }

  async handleChangeSort(value) {
    if (value) {
      await this.setState({
        loadingIndex: true,
        sortBy: value.label,
        sortData: [],
        isSort: true,
      });
      this.setData();
      await this.setState({ loadingIndex: false, isSort: false });
    } else {
      this.setState({ sortBy: "High to LTP" });
    }
  }

  render() {
    return (
      <div className="heatmap">
        {!this.state.loading ? (
          <>
            <div className="row d-flex justify-content-center">
              <Form.Group>
                <Form.Label>Select Index:</Form.Label>
                <Select
                  className="heatmap__select-index"
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
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Sort By:</Form.Label>
                <Select
                  className="heatmap__sort-by"
                  inputId="sort-by"
                  TextFieldProps={{
                    label: "Sort By: ",
                    InputLabelProps: {
                      htmlFor: "sort-by",
                      shrink: true,
                    },
                    placeholder: "Sort By",
                  }}
                  options={[
                    ...this.state.sortByOptions.map((i) => {
                      return {
                        label: i,
                      };
                    }),
                  ]}
                  backspaceRemovesValue={false}
                  isDisabled={this.state.isSort}
                  defaultInputValue={this.state.sortByOptions[0]}
                  onChange={this.handleChangeSort}
                  isClearable={true}
                />
              </Form.Group>
              {this.state.maxUp ? (
                <Button
                  className="btn btn-primary font-weight-bolder font-size-sm heatmap__max-min"
                  onClick={this.handleMaxUp}
                  disabled={this.state.isSort}
                >
                  MAX UP
                </Button>
              ) : (
                <Button
                  className="btn btn-dark font-weight-bolder font-size-sm heatmap__max-min"
                  onClick={this.handleMaxUp}
                  disabled={this.state.isSort}
                >
                  MIN UP
                </Button>
              )}
            </div>

            {!this.state.isSort ? (
              <div className="row d-flex justify-content-center">
                <p className="text-muted oivolume__contract-timestamp">
                  Last Updated - {this.state.timestamp}
                </p>
              </div>
            ) : null}

            {!this.state.loadingIndex ? (
              <div className="row">
                {this.state.sortData.map((i) => {
                  return (
                    <div
                      className="col-lg-6 col-xxl-3 mb-3 animate__animated animate__fadeIn"
                      key={i.symbol}
                    >
                      {i.pchange > 0 ? (
                        <div className="col bg-light-success px-6 py-8 rounded-xl shadow heatmap__index">
                          <div className="row mb-3">
                            <p className="text-success font-weight-bolder display-4 heatmap__index-title">
                              {i.symbol}
                            </p>
                            <p className="text-secondary font-weight-bold display-4 heatmap__index-value">
                              {i.currentPrice.toLocaleString("hi-IN")}
                            </p>
                          </div>
                          <div className="row text-success d-flex justify-content-center heatmap__index-percent">
                            {i.pchange.toLocaleString("hi-IN", {
                              maximumFractionDigits: 2,
                            })}{" "}
                            %
                          </div>
                          <div className="row d-flex justify-content-center">
                            <p className="text-warning h3 heatmap__index-ohlc">
                              {i.open.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.high.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.low.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.close.toLocaleString("hi-IN")}
                            </p>
                          </div>
                          <div className="row m-0 p-0 d-flex justify-content-center">
                            <pre className="text-muted heatmap__index-ohlc-title">
                              {
                                "Open           High            Low         Close"
                              }
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="col bg-light-danger px-6 py-8 rounded-xl shadow heatmap__index">
                          <div className="row mb-3">
                            <p className="text-danger font-weight-bolder display-4 heatmap__index-title">
                              {i.symbol}
                            </p>
                            <p className="text-secondary font-weight-bold display-4 heatmap__index-value">
                              {i.currentPrice.toLocaleString("hi-IN")}
                            </p>
                          </div>
                          <div className="row text-danger d-flex justify-content-center heatmap__index-percent">
                            {i.pchange.toLocaleString("hi-IN", {
                              maximumFractionDigits: 2,
                            })}{" "}
                            %
                          </div>
                          <div className="row d-flex justify-content-center">
                            <p className="text-warning h3 heatmap__index-ohlc">
                              {i.open.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.high.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.low.toLocaleString("hi-IN")}{" "}
                              <span className="text-primary">|</span>{" "}
                              {i.close.toLocaleString("hi-IN")}
                            </p>
                          </div>
                          <div className="row m-0 p-0 d-flex justify-content-center">
                            <pre className="text-muted heatmap__index-ohlc-title">
                              {"Open         High          Low       Close"}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <CommonLoading />
            )}
          </>
        ) : (
          <>
            {this.state.message !== "" ? (
              <Alert variant="danger" className="row spotfuturespread__alert">
                {this.state.message + " - Check connection and reload the page"}
              </Alert>
            ) : null}
            <BoxLoading />
          </>
        )}
      </div>
    );
  }
}

export default HeatMap;
