import React, { Component } from "react";
import { Table, Form, Button, Alert } from "react-bootstrap";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import { BoxLoading, CommonLoading } from "react-loadingg";

import * as NseURL from "./../../../utils/NSE_Urls";

const gaussian = require("./../../../utils/gaussian");

class OptionGreeksCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      data: [],
      optionChainData: {},
      expiryDates: [],
      underlyingValue: "",
      timestamp: "",
      tablesSet: false,
      contractName: "",
      showFields: false,
      strikePrices: [],
      volatility: 0.0,
      interest: 3.29,
      dividend: 0.0,
      optionType: "call-option", // 'put-option',
      strikePrice: "",
      expiry: "",
      errorValues: false,
      greeks: {
        call_option_prem_value: 0.0,
        put_option_prem_value: 0.0,
        call_option_delta_value: 0.0,
        put_option_delta_value: 0.0,
        option_gamma_value: 0.0,
        call_option_theta_value: 0.0,
        put_option_theta_value: 0.0,
        class_option_rho_value: 0.0,
        put_option_rho_value: 0.0,
        option_vega_value: 0.0,
      },
    };
    this.getSymbols = this.getSymbols.bind(this);
    this.getIndicesData = this.getIndicesData.bind(this);
    this.getEquitesData = this.getEquitesData.bind(this);
    this.handleChangeContract = this.handleChangeContract.bind(this);
    this.setSpotPrice = this.setSpotPrice.bind(this);
    this.setStrikePrice = this.setStrikePrice.bind(this);
    this.setExpiry = this.setExpiry.bind(this);
    this.setInterest = this.setInterest.bind(this);
    this.setVolatility = this.setVolatility.bind(this);
    this.calculateGreeks = this.calculateGreeks.bind(this);
    this.handleOptionTypeChange = this.handleOptionTypeChange.bind(this);
  }

  async getSymbols() {
    try {
      const symbols_url = NseURL.Nse_main_URL + NseURL.AllSymbolsURL;

      const response = await fetch(symbols_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          loading: false,
          data: ["NIFTY", "BANKNIFTY", ...Data],
          message: "",
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          data: [],
        });
      }
      console.log("Data: ", this.state.data);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getIndicesData(symbol) {
    try {
      const option_chain_url =
        NseURL.Nse_main_URL + NseURL.OptionChainIndicesURL + symbol;

      const response = await fetch(option_chain_url);
      const Data = await response.json();

      if (Data) {
        await this.setState({
          loading: false,
          optionChainData: Data,
          strikePrices: Data.records.strikePrices,
          expiryDates: Data.records.expiryDates,
          message: "",
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          data: {},
        });
      }
      console.log("Option Chain Data: ", this.state.optionChainData);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getEquitesData(symbol) {
    try {
      const option_chain_url =
        NseURL.Nse_main_URL + NseURL.OptionChainEquitesURL + symbol;

      const response = await fetch(option_chain_url);
      const Data = await response.json();

      if (Data) {
        await this.setState({
          loading: false,
          optionChainData: Data,
          strikePrices: Data.records.strikePrices,
          expiryDates: Data.records.expiryDates,
          message: "",
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          data: {},
        });
      }
      console.log("Option Chain Data: ", this.state.optionChainData);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  setTables = () => {
    this.setState({ tablesSet: true });
  };

  async updateData(value) {
    if (value) {
      if (["NIFTY", "BANKNIFTY"].includes(value)) {
        await this.getIndicesData(value);
      } else {
        await this.getEquitesData(value);
      }
      await this.setState({
        underlyingValue: this.state.optionChainData.records.underlyingValue,
        timestamp: this.state.optionChainData.records.timestamp,
        showFields: true,
      });
      this.setVolatility();
      this.setTables();
      this.calculateGreeks();
    }
  }

  async componentDidMount() {
    this.getSymbols();
    this.interval = setInterval(
      () => this.updateData(this.state.contractName),
      25000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async handleChangeContract(value) {
    this.setState({ tablesSet: false });
    if (value) {
      await this.setState({
        contractName: value.label,
      });

      if (["NIFTY", "BANKNIFTY"].includes(value.label)) {
        await this.getIndicesData(value.label);
      } else {
        await this.getEquitesData(value.label);
      }
      await this.setState({
        expiryDates: this.state.optionChainData.records.expiryDates,
        expiry: this.state.expiryDates[0],
        strikePrice: this.state.strikePrices[0],
        underlyingValue: this.state.optionChainData.records.underlyingValue,
        timestamp: this.state.optionChainData.records.timestamp,
        showFields: true,
      });
      this.setVolatility();

      this.setTables();
    } else {
      this.setState({
        contractName: "",
        showFields: false,
      });
    }
  }

  async handleOptionTypeChange() {
    const ele = document.getElementsByName("option-type");
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].checked) {
        await this.setState({ optionType: ele[i].id });
      }
    }
    this.setVolatility();
  }

  async setSpotPrice(e) {
    await this.setState({ underlyingValue: e.target.value });
  }

  async setStrikePrice(e) {
    await this.setState({ strikePrice: e.target.value * 1 });
    this.setVolatility();
  }

  async setExpiry(e) {
    await this.setState({ expiry: e.target.value });
    this.setVolatility();
  }

  async setInterest(e) {
    await this.setState({ interest: e.target.value });
  }

  async setVolatility() {
    const v = this.state.optionChainData.records.data.filter(
      (i) =>
        i.strikePrice === this.state.strikePrice &&
        i.expiryDate === this.state.expiry
    );

    if (v.length > 0) {
      if (this.state.optionType === "call-option") {
        if (v[0].CE)
          await this.setState({ volatility: v[0].CE.impliedVolatility });
      } else {
        if (v[0].PE)
          await this.setState({ volatility: v[0].PE.impliedVolatility });
      }
    } else {
      await this.setState({ volatility: 0 });
    }
  }

  async calculateGreeks() {
    let myDate = new Date(this.state.expiry);
    let d = myDate.getDate();
    let m = myDate.getMonth();
    m += 1;
    let y = myDate.getFullYear();
    y = Math.abs(y);
    let newdate;
    if (m < 10 && d < 10) {
      newdate = y + "-0" + m + "-0" + d;
    } else {
      if (m < 10) newdate = y + "-0" + m + "-" + d;
      if (d < 10) newdate = y + "-" + m + "-0" + d;
    }

    let spot = parseFloat(this.state.underlyingValue),
      strike = parseFloat(this.state.strikePrice),
      expiry = newdate + " 23:59:00",
      volt = parseFloat(this.state.volatility),
      int_rate = parseFloat(this.state.interest);
    //   div_yld = parseFloat(this.state.dividend);

    console.log("Val: ", spot, strike, expiry, volt, int_rate);
    //Validation
    let error = null;

    if (isNaN(spot) || isNaN(strike) || isNaN(volt) || isNaN(int_rate)) {
      error = "Invalid Values - Check Spot, Strike, Volatility and Interest";
      this.setState({ errorValues: true, message: error });
    } else if (spot < 0 || strike < 0) {
      error = "Spot and Strike should be positive values";
      this.setState({ errorValues: true, message: error });
    } else if (volt < 0) {
      error = "Voltality should be greater than 0";
      this.setState({ errorValues: true, message: error });
    } else if (int_rate < 0 || int_rate > 100) {
      error = "Interest rate should be between 0 - 100";
      this.setState({ errorValues: true, message: error });
    } else {
      expiry = expiry.replace(" ", "T");

      let date_expiry = new Date(expiry),
        date_now = new Date();

      let seconds = Math.floor((date_expiry - date_now) / 1000),
        minutes = Math.floor(seconds / 60),
        hours = Math.floor(minutes / 60),
        delta_t = Math.floor(hours / 24) / 365.0;

      volt = volt / 100;
      int_rate = int_rate / 100;

      if (hours < 24) {
        error =
          "Please select a later date and time <br> Expiry should be minimum 24 hours from now";
        this.setState({ errorValues: true, message: error });
      } else {
        this.setState({ errorValues: false, message: "" });

        let d1 =
            (Math.log(spot / strike) +
              (int_rate + Math.pow(volt, 2) / 2) * delta_t) /
            (volt * Math.sqrt(delta_t)),
          d2 =
            (Math.log(spot / strike) +
              (int_rate - Math.pow(volt, 2) / 2) * delta_t) /
            (volt * Math.sqrt(delta_t));

        let fv_strike = strike * Math.exp(-1 * int_rate * delta_t);

        //For calculating CDF and PDF using gaussian library
        let distribution = gaussian(0, 1);

        //Premium Price
        let call_premium =
            spot * distribution.cdf(d1) - fv_strike * distribution.cdf(d2),
          put_premium =
            fv_strike * distribution.cdf(-1 * d2) -
            spot * distribution.cdf(-1 * d1);

        //Option greeks
        let call_delta = distribution.cdf(d1),
          put_delta = call_delta - 1;

        let call_gamma =
          distribution.pdf(d1) / (spot * volt * Math.sqrt(delta_t));
        //   put_gamma = call_gamma;

        let call_vega =
          (spot * distribution.pdf(d1) * Math.sqrt(delta_t)) / 100;
        //   put_vega = call_vega;

        let call_theta =
            ((-1 * spot * distribution.pdf(d1) * volt) /
              (2 * Math.sqrt(delta_t)) -
              int_rate * fv_strike * distribution.cdf(d2)) /
            365,
          put_theta =
            ((-1 * spot * distribution.pdf(d1) * volt) /
              (2 * Math.sqrt(delta_t)) +
              int_rate * fv_strike * distribution.cdf(-1 * d2)) /
            365;

        let call_rho = (fv_strike * delta_t * distribution.cdf(d2)) / 100,
          put_rho =
            (-1 * fv_strike * delta_t * distribution.cdf(-1 * d2)) / 100;

        await this.setState({
          greeks: {
            call_option_prem_value: call_premium.toFixed(2),
            put_option_prem_value: put_premium.toFixed(2),
            call_option_delta_value: call_delta.toFixed(3),
            put_option_delta_value: put_delta.toFixed(3),
            option_gamma_value: call_gamma.toFixed(4),
            call_option_theta_value: call_theta.toFixed(3),
            put_option_theta_value: put_theta.toFixed(3),
            class_option_rho_value: call_rho.toFixed(3),
            put_option_rho_value: put_rho.toFixed(3),
            option_vega_value: call_vega.toFixed(3),
          },
        });
        console.log("Greeks: ", this.state.greeks);
      }
    }
  }

  colorGreeks = (value) => {
    if (value >= 0) {
      return <span className="text-success">{value}</span>;
    } else {
      return <span className="text-danger">{value}</span>;
    }
  };

  render() {
    return (
      <div className="optiongreeks">
        {!this.state.loading ? (
          <>
            {this.state.errorValues && this.state.contractName !== "" ? (
              <Alert variant="danger" className="row spotfuturespread__alert">
                {this.state.message}
              </Alert>
            ) : null}

            <div className="row d-flex justify-content-center">
              <Form.Group>
                <Form.Label>Select Contract:</Form.Label>
                <Select
                  className="optiongreeks__select-contract"
                  inputId="select_contract"
                  TextFieldProps={{
                    label: "Select Contract: ",
                    InputLabelProps: {
                      htmlFor: "select_contract",
                      shrink: true,
                    },
                    placeholder: "Select Contract",
                  }}
                  options={[
                    ...this.state.data.map((i) => {
                      return {
                        label: i,
                      };
                    }),
                  ]}
                  isClearable={true}
                  onChange={this.handleChangeContract}
                />
              </Form.Group>
            </div>

            {this.state.showFields ? (
              <>
                <div className="row d-flex justify-content-center">
                  <span className="optiongreeks__spot-price">
                    <TextField
                      id="spot-price"
                      label="Spot Price"
                      className="optiongreeks__spot-price-field"
                      value={this.state.underlyingValue}
                      onChange={this.setSpotPrice}
                      margin="normal"
                      variant="outlined"
                    />
                  </span>

                  <span className="optiongreeks__strike-price">
                    <Form.Group controlId="strike-price">
                      <Form.Label>Strike Price</Form.Label>
                      <Form.Control as="select" onChange={this.setStrikePrice}>
                        {this.state.strikePrices.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </span>

                  <span className="optiongreeks__expiry">
                    <Form.Group controlId="expiry">
                      <Form.Label>Expiry</Form.Label>
                      <Form.Control as="select" onChange={this.setExpiry}>
                        {this.state.expiryDates.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </span>
                </div>

                <div className="row d-flex justify-content-center">
                  <span className="optiongreeks__volatility">
                    <TextField
                      id="volatility"
                      label="Volatility"
                      className="optiongreeks__volatility-field"
                      value={this.state.volatility}
                      // onChange={handleChange("name")}
                      margin="normal"
                      variant="outlined"
                    />
                  </span>

                  <span className="optiongreeks__interest">
                    <TextField
                      id="interest"
                      label="Interest-91 day T-bills-RBI"
                      className="optiongreeks__interest-field"
                      value={this.state.interest}
                      onChange={this.setInterest}
                      margin="normal"
                      variant="outlined"
                    />
                  </span>

                  {/* <span className="optiongreeks__dividend">
                    <TextField
                      id="dividend"
                      label="Dividend"
                      className="optiongreeks__dividend-field"
                      value={this.state.dividend}
                      // onChange={handleChange("name")}
                      margin="normal"
                      variant="outlined"
                    />
                  </span> */}
                </div>

                <div className="row d-flex justify-content-center">
                  <Form.Group className="optiongreeks__option-type">
                    <Form.Check
                      custom
                      inline
                      defaultChecked
                      label="Call Option"
                      type="radio"
                      id="call-option"
                      name="option-type"
                      onClick={this.handleOptionTypeChange}
                    />
                    <Form.Check
                      custom
                      inline
                      label="Put Option"
                      type="radio"
                      id="put-option"
                      name="option-type"
                      onClick={this.handleOptionTypeChange}
                    />
                  </Form.Group>
                </div>

                <div className="row d-flex justify-content-center">
                  <Button
                    variant="info optiongreeks__calculate"
                    onClick={this.calculateGreeks}
                  >
                    Calculate
                  </Button>
                </div>

                <div className="row d-flex justify-content-center">
                  <p className="text-muted oivolume__contract-timestamp">
                    Last Updated - {this.state.timestamp}
                  </p>
                </div>

                <div className="row d-flex justify-content-center">
                  <Table striped bordered hover className="optiongreeks__table">
                    <thead>
                      <tr className="bg-light-primary">
                        <th>Call Option Premium</th>
                        <th>Put Option Premium</th>
                        <th>Call Option Delta</th>
                        <th>Put Option Delta</th>
                        <th>Option Gamma</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-light-info">
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.call_option_prem_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.put_option_prem_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.call_option_delta_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.put_option_delta_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.option_gamma_value
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="row d-flex justify-content-center">
                  <Table striped bordered hover className="optiongreeks__table">
                    <thead>
                      <tr className="bg-light-primary">
                        <th>Call Option Theta</th>
                        <th>Put Option Theta</th>
                        <th> Call Option Rho</th>
                        <th>Put Option Rho</th>
                        <th>Option Vega</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-light-info">
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.call_option_theta_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.put_option_theta_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.class_option_rho_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.put_option_rho_value
                          )}
                        </td>
                        <td className="display-3">
                          {this.colorGreeks(
                            this.state.greeks.option_vega_value
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </>
            ) : this.state.contractName !== "" ? (
              <CommonLoading />
            ) : null}
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

export default OptionGreeksCalculator;
