import React, { Component } from "react";
import { Card, Alert } from "react-bootstrap";
import Select from "react-select";
import { BoxLoading } from "react-loadingg";

import store from "./../../../../redux/store";
import * as Helper from "./../../../utils/helpers";
import * as NseURL from "./../../../utils/NSE_Urls";

class SpotFutureSpread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchFor: "",
      loading: true,
      message: "",
      timestamp: "",
      priceData: {
        name: "",
        spot: "--",
        future: "--",
        min: 1000,
        max: -1000,
        p_d: "--",
      },
      searchValue: {},
    };
    this.getData = this.getData.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  async handleChangeSearch(value) {
    if (value.label === "None") {
      await this.setState({
        searchFor: "",
        priceData: {
          name: "",
          spot: "--",
          future: "--",
          min: 1000,
          max: -1000,
          p_d: "--",
        },
      });
    } else {
      this.setState({ searchFor: value.label, searchValue: value });
      let _p_d = value.lastPrice - value.underlyingValue;
      _p_d = +_p_d.toFixed(2);
      this.setState({
        priceData: {
          name: value.label,
          spot: value.underlyingValue,
          future: value.lastPrice,
          min: this.state.min < _p_d ? this.state.min : _p_d,
          max: this.state.max > _p_d ? this.state.max : _p_d,
          p_d: _p_d,
        },
      });
    }
    // console.log("Value: ", this.state.searchFor);
  }

  async getData() {
    try {
      const stock_futures_url =
        NseURL.Nse_main_URL + NseURL.Derivatives_URL + "stock_fut";
      const nifty_futures_url =
        NseURL.Nse_main_URL + NseURL.Derivatives_URL + "nse50_fut";
      const nifty_bank_futures_url =
        NseURL.Nse_main_URL + NseURL.Derivatives_URL + "nifty_bank_fut";

      const response = await fetch(stock_futures_url);
      const response_nifty = await fetch(nifty_futures_url);
      const response_niftybank = await fetch(nifty_bank_futures_url);

      const D1 = await response.json();
      const D2 = await response_nifty.json();
      const D3 = await response_niftybank.json();

      const Data = D2.data.concat(D3.data, D1.data);

      if (Data) {
        this.setState({
          data: Data,
          timestamp: D1.timestamp,
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
          data: [],
        });
      }
      // console.log("Data: ", this.state.data);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  async updateData() {
    await this.getData();

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

    if (this.state.searchFor !== "") {
      const ut = this.state.data
        .filter((i) => i.contract === this.state.searchFor)
        .map((i) => {
          return {
            label: i.contract,
            lastPrice: i.lastPrice,
            underlyingValue: i.underlyingValue,
          };
        });
      let _p_d = ut[0].lastPrice - ut[0].underlyingValue;
      _p_d = +_p_d.toFixed(2);
      await this.setState({
        priceData: {
          name: ut[0].label,
          spot: ut[0].underlyingValue,
          future: ut[0].lastPrice,
          min:
            this.state.priceData.min < _p_d ? this.state.priceData.min : _p_d,
          max:
            this.state.priceData.max > _p_d ? this.state.priceData.max : _p_d,
          p_d: _p_d,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    await this.getData();

    if (this.state.message.length !== 0) {
      this.setUpdateInterval(3);
    } else {
      this.setUpdateInterval(25);
      await this.setState({ loading: false });
    }
  }

  setUpdateInterval = (time) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateData(), time * 1000);
  };

  render() {
    return this.state.loading ? (
      <>
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message + " - Check connection and reload the page"}
          </Alert>
        ) : null}
        <BoxLoading />
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
        <div className="spotfuturespread">
          <div className="row">
            <Select
              className="spotfuturespread__search-input"
              inputId="search_contract"
              TextFieldProps={{
                label: "Search Contract...",
                InputLabelProps: {
                  htmlFor: "search_contract",
                  shrink: true,
                },
                placeholder: "Search Contract",
              }}
              options={[
                { label: "None" },
                ...this.state.data.map((i) => {
                  return {
                    label: i.contract,
                    lastPrice: i.lastPrice,
                    underlyingValue: i.underlyingValue,
                  };
                }),
              ]}
              value={this.state.searchFor}
              onChange={this.handleChangeSearch}
            />
          </div>

          <div className="row d-flex justify-content-center">
            <p className="display-4 spotfuturespread__contract-name">
              {this.state.priceData.name}
            </p>
          </div>
          <div className="row d-flex justify-content-center">
            <p className="text-muted spotfuturespread__contract-timestamp">
              Last Updated - {this.state.timestamp}
            </p>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="spotfuturespread__spot">
              <Card border="success" style={{ width: "30rem" }}>
                <Card.Header className="mb-5 text-muted text-center">
                  Spot Price
                </Card.Header>
                <Card.Body>
                  <Card.Text className="display-1 text-center">
                    {this.state.priceData.spot.toLocaleString("hi-IN")}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>

            <div className="spotfuturespread__future">
              <Card border="warning" style={{ width: "30rem" }}>
                <Card.Header className="mb-5 text-muted text-center">
                  Future Price
                </Card.Header>
                <Card.Body>
                  <Card.Text className="display-1 text-center">
                    {this.state.priceData.future.toLocaleString("hi-IN")}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <p className="display-2 text-muted spotfuturespread__minvalue">
              {this.state.priceData.min.toLocaleString("hi-IN")}
            </p>
            min
            <p className="display-2 text-muted spotfuturespread__maxvalue">
              {this.state.priceData.max.toLocaleString("hi-IN")}
            </p>
            max
          </div>

          <div className="row d-flex justify-content-center">
            <div className="spotfuturespread__premium-discount">
              <Card border="info" style={{ width: "35rem" }}>
                <Card.Body>
                  <Card.Text className="text-center spotfuturespread__pdvalue">
                    {this.state.priceData.p_d.toLocaleString("hi-IN")}
                  </Card.Text>
                  <Card.Title className="text-muted text-center">
                    Premium / Discount
                  </Card.Title>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SpotFutureSpread;
