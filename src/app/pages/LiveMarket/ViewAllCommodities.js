import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { BoxLoading } from "react-loadingg";

import * as NseURL from "./../../utils/NSE_Urls";

class ViewAllCommodities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      allCommodity: [],
      message: "",
    };
    this.getCommodity = this.getCommodity.bind(this);
    this.updateData = this.updateData.bind(this);
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
      console.log("All Commodities: ", this.state.allCommodity);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  async updateData() {
    await this.getCommodity();

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      await this.setState({ loading: false });
      clearInterval(this.interval);
    }
  }

  setUpdateInterval = (time) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateData(), time * 1000);
  };

  async componentDidMount() {
    await this.setState({ loading: true });
    await this.getCommodity();

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      await this.setState({ loading: false });
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
        <div className="viewallcommodities">
          {!this.state.loading ? (
            this.state.allCommodity.map((j) => {
              return (
                <div className="col-lg-3 col-xxl-3" key={j.symbol}>
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7 shadow">
                    <div className="row">
                      <p className="text-warning font-weight-bolder h1 dashboard__commodity-title">
                        {j.symbol}
                      </p>
                      <p className="text-secondary font-weight-bold h1 dashboard__commodity-value">
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
            })
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

export default ViewAllCommodities;
