import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { BoxLoading } from "react-loadingg";

import * as NseURL from "./../../utils/NSE_Urls";

class ViewAllIndices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      allIndices: [],
      message: "",
    };
    this.getAllIndices = this.getAllIndices.bind(this);
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

  updateData = () => {
    this.getAllIndices();
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getAllIndices();
    this.setState({ loading: false });
    this.interval = setInterval(() => this.updateData(), 25000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="viewallindices">
        {!this.state.loading ? (
          this.state.allIndices.map((j) => {
            return (
              <div className="col-lg-6 col-xxl-3 mb-3" key={j.index}>
                {j.variation < 0 ? (
                  <div className="col bg-light-danger px-6 py-8 rounded-xl shadow dashboard__index">
                    <div className="row">
                      <p className="text-danger font-weight-bolder display-4 dashboard__index-title">
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
                      <p className="text-success font-weight-bolder display-4 dashboard__index-title">
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

export default ViewAllIndices;
