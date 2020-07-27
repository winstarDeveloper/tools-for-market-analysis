import React, { Component } from "react";
import { BoxLoading } from "react-loadingg";
import { Alert } from "react-bootstrap";

import * as NseURL from "../../../app/utils/NSE_Urls";
class MainDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marketStatus: [],
      allIndices: [],
      allCommodity: [],
      gainers: [],
      loosers: [],
      showGainers: true,
      message: "",
    };
    this.getMarketStatus = this.getMarketStatus.bind(this);
    this.getAllIndices = this.getAllIndices.bind(this);
    this.getCommodity = this.getCommodity.bind(this);
    this.getGainersLoosers = this.getGainersLoosers.bind(this);
  }

  async getMarketStatus() {
    try {
      const market_status_url = NseURL.Nse_main_URL + NseURL.MarketStatusURL;

      const response = await fetch(market_status_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          marketStatus: Data.marketState,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          marketStatus: [],
        });
      }
      console.log("Market Status: ", this.state.marketStatus);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getAllIndices() {
    try {
      const all_indices_url = NseURL.Nse_main_URL + NseURL.AllIndicesURL;

      const response = await fetch(all_indices_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          allIndices: Data.data,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          allIndices: [],
        });
      }
      console.log("All Indices: ", this.state.allIndices);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getCommodity() {
    try {
      const all_commodity_url =
        NseURL.Nse_main_URL + NseURL.CommoditySpotRatesURL;

      const response = await fetch(all_commodity_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          allCommodity: Data.data,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          allCommodity: [],
        });
      }
      console.log("All Commodities: ", this.state.allCommodity);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getGainersLoosers() {
    try {
      const gainers_url = NseURL.Nse_main_URL + NseURL.GainersURL;
      const loosers_url = NseURL.Nse_main_URL + NseURL.LoosersURL;

      const response = await fetch(gainers_url);
      const response1 = await fetch(loosers_url);
      const Data = await response.json();
      const Data1 = await response1.json();

      if (Data && Data1) {
        this.setState({
          gainers: Data.NIFTY.data,
          loosers: Data1.NIFTY.data,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          allCommodity: [],
        });
      }
      console.log(
        "Gainers: ",
        this.state.gainers,
        "Loosers:",
        this.state.loosers
      );
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  updateData = () => {
    this.getMarketStatus();
    this.getAllIndices();
    this.getCommodity();
    this.getGainersLoosers();
    this.setState({ loading: false });
  };

  async componentDidMount() {
    await this.setState({ loading: true });
    this.getMarketStatus();
    this.getAllIndices();
    this.getCommodity();
    this.getGainersLoosers();
    this.setState({ loading: false });
    this.interval = setInterval(() => this.updateData(), 25000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleGainerLooser = () => {
    if (this.state.showGainers) {
      this.setState({ showGainers: false });
    } else {
      this.setState({ showGainers: true });
    }
  };

  render() {
    return !this.state.loading ? (
      <div className="card-stretch gutter-b">
        <div className="row">
          <div className="col-lg-6 col-xxl-3">
            <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7 shadow">
              <p className="font-weight-bolder font-size-h4 mt-2 text-primary mb-0">
                Market Status:
              </p>

              <div className="card-body pt-4">
                <div className="mt-3">
                  <table className="table table-borderless m-0 p-0">
                    <thead>
                      <tr className="text-left text-uppercase">
                        <th style={{ minWidth: "140px" }}></th>
                        <th style={{ minWidth: "220px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.marketStatus.map((i, index) => {
                        return (
                          <tr
                            key={index}
                            className="font-weight-bolder text-dark-75 pl-3 font-size-lg ml-0 mb-0"
                          >
                            <td className="text-left">{i.market + " : "}</td>
                            <td className="text-left">
                              {i.marketStatus !== "Close" ? (
                                <p className="text-success m-0">
                                  {i.marketStatusMessage}
                                </p>
                              ) : (
                                <p className="text-danger m-0">
                                  {i.marketStatusMessage}
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {this.state.allIndices
            .filter(
              (i) =>
                i.indexSymbol === "NIFTY 50" || i.indexSymbol === "NIFTY 500"
            )
            .map((j) => {
              return (
                <div className="col-lg-6 col-xxl-3 mb-3" key={j.index}>
                  {j.variation < 0 ? (
                    <div className="col bg-light-danger px-6 py-8 rounded-xl shadow dashboard__index">
                      <div className="row">
                        <p className="text-info font-weight-bolder display-4 dashboard__index-title">
                          {j.index}
                        </p>
                        <p className="text-secondary font-weight-bold display-4 mt-2 dashboard__index-value">
                          {j.last.toLocaleString("hi-IN")}
                        </p>
                      </div>
                      <div className="row">
                        <p className="text-danger h3 dashboard__index-data">
                          {j.variation.toLocaleString("hi-IN")} /{" "}
                          {j.percentChange.toLocaleString("hi-IN")}%
                        </p>
                      </div>
                      <div className="row">
                        <p className="text-warning h3 dashboard__index-ohlc">
                          {j.open.toLocaleString("hi-IN")} |{" "}
                          {j.high.toLocaleString("hi-IN")} |{" "}
                          {j.low.toLocaleString("hi-IN")}|{" "}
                          {j.previousClose.toLocaleString("hi-IN")}
                        </p>
                      </div>
                      <div className="row m-0">
                        <pre className="text-muted dashboard__index-ohlc-title">
                          {"Open           High            Low         Close"}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="col bg-light-success px-6 py-8 rounded-xl shadow dashboard__index">
                      <div className="row">
                        <p className="text-secondary text-muted font-weight-bolder display-4 dashboard__index-title">
                          {j.index}
                        </p>
                        <p className="text-secondary font-weight-bold display-4 mt-2 dashboard__index-value">
                          {j.last.toLocaleString("hi-IN")}
                        </p>
                      </div>
                      <div className="row">
                        <p className="text-danger h3 dashboard__index-data">
                          {j.variation.toLocaleString("hi-IN")} /{" "}
                          {j.percentChange.toLocaleString("hi-IN")}%
                        </p>
                      </div>
                      <div className="row">
                        <p className="text-warning h3 dashboard__index-ohlc">
                          {j.open.toLocaleString("hi-IN")} |{" "}
                          {j.high.toLocaleString("hi-IN")} |{" "}
                          {j.low.toLocaleString("hi-IN")}|{" "}
                          {j.previousClose.toLocaleString("hi-IN")}
                        </p>
                      </div>
                      <div className="row m-0">
                        <pre className="text-muted dashboard__index-ohlc-title">
                          {"Open           High            Low         Close"}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {this.state.allCommodity
            .filter((i) => i.symbol === "GOLD")
            .map((j) => {
              return (
                <div className="col-lg-6 col-xxl-3" key={j.symbol}>
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7 shadow">
                    <div className="row">
                      <p className="text-warning font-weight-bolder display-4 dashboard__commodity-title">
                        {j.symbol}
                      </p>
                      <p className="text-secondary font-weight-bold display-4 dashboard__commodity-value">
                        {(j.spotPrice * 1).toLocaleString("hi-IN")} (
                        {(j.spotPrice * 1 - j.lastSpotPrice * 1).toLocaleString(
                          "hi-IN"
                        )}
                        )
                      </p>
                    </div>
                    <div className="row">
                      <p className="text-warning h5 dashboard__commodity-subtext">
                        {j.lotSize}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="card card-custom card-stretch gutter-b rounded-xl shadow">
              {/* Head */}
              <div className="card-header border-0 py-5">
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label font-weight-bolder h2 text-info">
                    NIFTY Gainers / Losers
                  </span>
                </h3>
                <div className="card-toolbar">
                  {this.state.showGainers ? (
                    <>
                      <p
                        className="btn btn-success font-weight-bolder font-size-sm mr-3"
                        onClick={this.handleGainerLooser}
                      >
                        Gainers
                      </p>
                      <p
                        className="btn btn-outline-danger font-weight-bolder font-size-sm"
                        onClick={this.handleGainerLooser}
                      >
                        Losers
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className="btn btn-outline-success font-weight-bolder font-size-sm mr-3"
                        onClick={this.handleGainerLooser}
                      >
                        Gainers
                      </p>
                      <p
                        className="btn btn-danger font-weight-bolder font-size-sm"
                        onClick={this.handleGainerLooser}
                      >
                        Losers
                      </p>
                    </>
                  )}
                </div>
              </div>
              {/* Body */}
              <div className="card-body pt-0 pb-3">
                <div className="tab-content">
                  <div className="table-responsive">
                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                      <thead>
                        <tr className="text-left text-uppercase">
                          <th className="pl-7" style={{ minWidth: "250px" }}>
                            <span className="text-dark-75">Symbol</span>
                          </th>
                          <th style={{ minWidth: "130px" }}>LTP</th>
                          <th style={{ minWidth: "130px" }}>% change</th>
                          <th style={{ minWidth: "130px" }}>Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.showGainers
                          ? this.state.gainers.map((i) => {
                              return (
                                <tr key={i.symbol}>
                                  <td className="pl-0 py-8">
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                          {i.symbol}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                      {i.ltp.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-success font-weight-bolder d-block font-size-lg">
                                      {i.perChange.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                      {i.trade_quantity.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          : this.state.loosers.map((i) => {
                              return (
                                <tr key={i.symbol}>
                                  <td className="pl-0 py-8">
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                          {i.symbol}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                      {i.ltp.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-danger font-weight-bolder d-block font-size-lg">
                                      {i.perChange.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                      {i.trade_quantity.toLocaleString("hi-IN")}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <>
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message + " - Check connection and reload the page"}
          </Alert>
        ) : null}
        <BoxLoading />
      </>
    );
  }
}

export default MainDashboard;
