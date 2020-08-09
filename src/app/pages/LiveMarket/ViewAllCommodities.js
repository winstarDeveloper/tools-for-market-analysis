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

  // updateData = () => {
  //   this.getCommodity();
  //   this.setState({ loading: false });
  // };

  componentDidMount() {
    this.getCommodity();
    this.setState({ loading: false });
    // this.interval = setInterval(() => this.updateData(), 25000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  render() {
    return (
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

export default ViewAllCommodities;
