import React, { Component } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { BoxLoading, CommonLoading } from "react-loadingg";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import InfoCard from "../../../Components/HMInfoCard";

import store from "./../../../redux/store";
import * as Helper from "./../../utils/helpers";
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
      sortByOptions: [
        "Previous Close to LTP",
        "High to LTP",
        "Open to LTP",
        "Low to LTP",
      ],
      isSort: true,
      indexData: [],
      sortData: [],
      timestamp: "",
      maxUp: true,
      trueRange: false,
      message: "",
    };
    this.getIndicesList = this.getIndicesList.bind(this);
    this.getIndexData = this.getIndexData.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.handleMaxUp = this.handleMaxUp.bind(this);
    this.handleTrueRangeChange = this.handleTrueRangeChange.bind(this);
  }

  async getIndicesList() {
    try {
      const indices_url = NseURL.Nse_main_URL + NseURL.IndicesListURL;

      const response = await fetch(indices_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          indicesList: Data,
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          indicesList: {},
        });
      }
      // console.log("Indices List: ", this.state.indicesList);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
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
          message: "",
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          indexData: [],
        });
      }
      // console.log("Index Data: ", this.state.indexData);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  setUpdateInterval = (time) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateData(), time * 1000);
  };

  async updateData() {
    if (!this.state.loading && this.state.indexName !== "") {
      await this.getIndexData(this.state.indexName);
      this.setData();
    }

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
      return;
    } else {
      this.setUpdateInterval(25);
      await this.setState({ loading: false });
    
      if (Helper.checkMarketStatus(store.getState())) {
      } else {
        console.log("Market Closed");
        clearInterval(this.interval);
      }
    }
  }

  async updateDataLocal() {
    if (!this.state.loading && this.state.indexName !== "") {
      this.setData();
    }
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    // this.getIndicesList();
    // this.getIndexData("NIFTY 50");
    await this.setState({ loading: false });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async handleMaxUp() {
    await this.setState({ maxUp: !this.state.maxUp });
    this.updateDataLocal();
  }

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

  sortByTrueRange = (a, b) => {
    let comparison = 0;
    if (this.state.trueRange) {
      if (this.state.maxUp) {
        if (a.trueRangePercent > b.trueRangePercent) {
          comparison = -1;
        } else {
          comparison = 1;
        }
      } else {
        if (a.trueRangePercent > b.trueRangePercent) {
          comparison = 1;
        } else {
          comparison = -1;
        }
      }
    }
    return comparison;
  };

  setData = () => {
    this.setState({
      sortData: this.state.indexData
        .map((i) => {
          if (this.state.sortBy === "High to LTP") {
            return {
              symbol: i.symbol,
              priority: i.priority,
              open: i.open,
              high: i.dayHigh,
              low: i.dayLow,
              close: i.previousClose,
              currentPrice: i.lastPrice,
              pchange: ((i.lastPrice - i.dayHigh) * 100) / i.dayHigh,
              change: i.lastPrice - i.dayHigh,
              trueRange: i.dayHigh - i.dayLow,
              trueRangePercent:
                ((i.dayHigh - i.dayLow) * 100) / i.previousClose,
            };
          } else if (this.state.sortBy === "Open to LTP") {
            return {
              symbol: i.symbol,
              priority: i.priority,
              open: i.open,
              high: i.dayHigh,
              low: i.dayLow,
              close: i.previousClose,
              currentPrice: i.lastPrice,
              pchange: ((i.lastPrice - i.open) * 100) / i.open,
              change: i.lastPrice - i.open,
              trueRange: i.dayHigh - i.dayLow,
              trueRangePercent:
                ((i.dayHigh - i.dayLow) * 100) / i.previousClose,
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
              change: i.lastPrice - i.dayLow,
              trueRange: i.dayHigh - i.dayLow,
              trueRangePercent:
                ((i.dayHigh - i.dayLow) * 100) / i.previousClose,
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
              pchange:
                ((i.lastPrice - i.previousClose) * 100) / i.previousClose,
              change: i.lastPrice - i.previousClose,
              trueRange: i.dayHigh - i.dayLow,
              trueRangePercent:
                ((i.dayHigh - i.dayLow) * 100) / i.previousClose,
            };
          }
        })
        .sort(this.sortByPChange)
        .sort(this.sortByTrueRange)
        .sort(this.sortByPriority),
    });
    // console.log("sortData: ", this.state.sortData);
  };

  async handleChangeIndex(value) {
    if (value) {
      await this.setState({ loadingIndex: true, indexName: value.label });
      await this.getIndexData(value.label);
      this.setData();
      await this.setState({ loadingIndex: false, isSort: false });

      if (this.state.message.length !== 0) {
        this.setUpdateInterval(3);
      } else {
        this.setUpdateInterval(25);
        await this.setState({ loading: false });
      }
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
      this.setState({ sortBy: "Previous Close to LTP" });
    }
  }

  async handleTrueRangeChange() {
    await this.setState({ trueRange: !this.state.trueRange });
    this.updateDataLocal();
  }

  render() {
    return (
      <>
        {!this.state.loading && this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message}
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Alert>
        ) : null}
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

                <div className="mr-10 ml-20">
                  <div className="row">
                    <Form.Label>True Range:</Form.Label>
                  </div>
                  <div className="row">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.trueRange}
                          onChange={this.handleTrueRangeChange}
                          value="true_range"
                          color="primary"
                          disabled={this.state.isSort}
                        />
                      }
                      label={this.state.trueRange ? "ON " : "OFF"}
                    />
                  </div>
                </div>

                <div className="mr-10 ml-20">
                  <div className="row">
                    <Form.Label>Sort by Min/Max:</Form.Label>
                  </div>
                  <div className="row">
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
                </div>
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
                      <InfoCard
                        key={i.symbol}
                        data={i}
                        trueRange={this.state.trueRange}
                      />
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
                  {this.state.message}
                  <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </Alert>
              ) : null}
              <BoxLoading />
            </>
          )}
        </div>
      </>
    );
  }
}

export default HeatMap;
