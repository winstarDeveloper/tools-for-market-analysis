import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { BoxLoading } from "react-loadingg";

import InfoCard from "./../../../Components/InfoCard";

import store from "./../../../redux/store";
import * as Helper from "./../../utils/helpers";
import * as NseURL from "./../../utils/NSE_Urls";

class ViewAllIndices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      allIndices: [],
      timestamp: "",
      message: "",
    };
    this.getAllIndices = this.getAllIndices.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  async getAllIndices() {
    try {
      const all_indices_url = NseURL.Nse_main_URL + NseURL.AllIndicesURL;

      const response = await fetch(all_indices_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          allIndices: Data.data,
          timestamp: Data.timestamp,
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

  setUpdateInterval = (time) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateData(), time * 1000);
  };

  async updateData() {
    await this.getAllIndices();

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      this.setUpdateInterval(25);
      await this.setState({ loading: false });
    }

    if (
      Helper.checkMarketStatus(store.getState()) ||
      this.state.message.length !== 0
    ) {
    } else {
      // console.log("Market Closed");
      clearInterval(this.interval);
    }
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    await this.getAllIndices();

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
        {!this.state.loading && this.state.timestamp !== "" ? (
          <div className="row d-flex justify-content-center">
            <p className="text-muted oivolume__contract-timestamp">
              Last Updated - {this.state.timestamp}
            </p>
          </div>
        ) : null}
        <div className="viewallindices">
          {!this.state.loading ? (
            <>
              {this.state.allIndices.map((j, idx) => {
                return <InfoCard key={idx} data={j} />;
              })}
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

export default ViewAllIndices;
