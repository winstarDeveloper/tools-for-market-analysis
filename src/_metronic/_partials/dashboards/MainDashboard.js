import React, { Component } from "react";
import { BoxLoading } from "react-loadingg";
import { Alert } from "react-bootstrap";

import InfoCard from "./../../../Components/InfoCard";

import store from "./../../../redux/store";
import * as MarketStatus from "./../../../redux/dataObjects/marketStatus";
import * as Helper from "./../../../app/utils/helpers";
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
    this.updateDataOnError = this.updateDataOnError.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  async getMarketStatus() {
    try {
      const market_status_url = NseURL.Nse_main_URL + NseURL.MarketStatusURL;

      const response = await fetch(market_status_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          marketStatus: Data.marketState,
          message: "",
        });
        store.dispatch(MarketStatus.actions.addMarketStatus(Data.marketState));
      } else {
        this.setState({
          message: "Error Receiving Data",
          marketStatus: [],
        });
      }
      // console.log("Market Status: ", this.state.marketStatus);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
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
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          allIndices: [],
        });
      }
      // console.log("All Indices: ", this.state.allIndices);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
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
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          allCommodity: [],
        });
      }
      // console.log("All Commodities: ", this.state.allCommodity);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
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
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          allCommodity: [],
        });
      }
      // console.log(
      //   "Gainers: ",
      //   this.state.gainers,
      //   "Loosers:",
      //   this.state.loosers
      // );
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  async updateDataOnError() {
    await this.getMarketStatus();
    await this.getAllIndices();
    await this.getCommodity();
    await this.getGainersLoosers();
    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      this.setUpdateInterval(25);
      await this.setState({ loading: false });
    }
  }

  async updateData() {
    await this.updateDataOnError();
    if (
      Helper.checkMarketStatus(store.getState()) ||
      this.state.message.length !== 0
    ) {
      
    } else {
      // console.log("Market Closed");
      clearInterval(this.interval);
    }
  };

  setUpdateInterval = (time) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateData(), time * 1000);
  };

  async componentDidMount() {
    await this.setState({ loading: true });
    await this.getMarketStatus();
    await this.getAllIndices();
    await this.getCommodity();
    await this.getGainersLoosers();

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      this.setUpdateInterval(25);
      await this.setState({ loading: false });
    }
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
      <>
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message}
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </Alert>
        ) : null}
        <div className="card-stretch gutter-b">
          <div className="row">
            <div className="col-lg-3 col-xxl-3">
              <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7 shadow">
                <p className="font-weight-bolder font-size-h4 mt-2 text-primary mb-0">
                  Market Status:
                </p>

                <div className="card-body p-0">
                  <div className="mx-auto text-center">
                    <table className="table table-borderless">
                      <thead>
                        <tr className="text-left text-uppercase">
                          <th style={{ minWidth: "auto" }}></th>
                          <th style={{ minWidth: "auto" }}></th>
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
                                {i.marketStatus === "Closed" ||
                                i.marketStatus === "Close" ? (
                                  <p className="text-danger m-0">
                                    {i.marketStatusMessage}
                                  </p>
                                ) : (
                                  <p className="text-success m-0">
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
              .map((j, idx) => {
                return <InfoCard key={idx} data={j} />;
              })}

            {this.state.allCommodity
              .filter((i) => i.symbol === "GOLD")
              .map((j) => {
                return (
                  <div className="col-lg-3 col-xxl-3" key={j.symbol}>
                    <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7 shadow">
                      <div className="row">
                        <p className="text-warning font-weight-bolder h1 dashboard__commodity-title">
                          {j.symbol}
                        </p>
                        <p className="text-secondary font-weight-bold h1 dashboard__commodity-value">
                          {(j.spotPrice * 1).toLocaleString("hi-IN")} (
                          {(
                            j.spotPrice * 1 -
                            j.lastSpotPrice * 1
                          ).toLocaleString("hi-IN")}
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
                                        {i.trade_quantity.toLocaleString(
                                          "hi-IN"
                                        )}
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
                                        {i.trade_quantity.toLocaleString(
                                          "hi-IN"
                                        )}
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
    );
  }
}

export default MainDashboard;
