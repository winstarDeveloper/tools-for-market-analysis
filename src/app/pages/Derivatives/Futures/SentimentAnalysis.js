import React, { Component } from "react";
import { Alert, Form /*, InputGroup, FormControl*/ } from "react-bootstrap";
import Select from "react-select";
import { BoxLoading, CommonLoading } from "react-loadingg";
import TextField from "@material-ui/core/TextField";

import store from "./../../../../redux/store";
import * as Helper from "./../../../utils/helpers";
import * as NseURL from "./../../../utils/NSE_Urls";

export default class SentimentAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      enctoken:
        "4djxMX/V5sNaYaEmyE78ze9aEKXd39vSYj0hW1UpGAkrBCv5+PdyIn8yMoe1niVVNPdfhKUC5Lkc8G2NOqoTE9XzlqDNBw==",
      symbolList: [],
      futuresList: [],
      symbolName: "",
      contractName: "",
      contractData: [],
      isContractData: false,
      percentValue: 0.5,
      finalValues: null,
      loadingData: false,
    };
    this.getFuturesList = this.getFuturesList.bind(this);
    this.getFutureData = this.getFutureData.bind(this);
    this.handleChangeSymbol = this.handleChangeSymbol.bind(this);
  }

  async getFuturesList() {
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
          symbolList: [...new Set(Data.map((i) => i.underlying))],
          //   timestamp: D1.timestamp,
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
        });
      }
      //console.log("Symbol List: ", this.state.symbolList);
    } catch (err) {
      this.setState({ message: "Error Retrieving Data - Retrying " });
      console.log("Error: ", err.message);
    }
  }

  async getFutureData(symbol) {
    try {
      const future_info_url =
        NseURL.Nse_main_URL + NseURL.DerivativeInfoURL + symbol;
      const response = await fetch(future_info_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          contractData: Data.stocks.filter(
            (i) =>
              i.metadata.instrumentType === "Index Futures" ||
              i.metadata.instrumentType === "Stock Futures"
          ),
          futuresList: Data.stocks
            .filter(
              (i) =>
                i.metadata.instrumentType === "Index Futures" ||
                i.metadata.instrumentType === "Stock Futures"
            )
            .map((i) => i.metadata.identifier),
          //   timestamp: Data.filter.fut_timestamp,
          message: "",
        });
      } else {
        this.setState({
          message: "Error Receiving Data",
        });
      }
      //console.log("Contract Data: ", this.state.contractData);
      //console.log("Futures List: ", this.state.futuresList);
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
    if (!this.state.loading && this.state.symbolName !== "") {
      await this.getFutureData(this.state.symbolName);
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

  async componentDidMount() {
    await this.getFuturesList();
    this.setState({ loading: false });
    this.updateData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleChangeEnctoken = (e) => {
    this.setState({ enctoken: e.target.value });
  };

  async handleChangeSymbol(value) {
    if (!value || value.label === "None") {
      this.setState({
        symbolName: "",
        contractName: "",
        isContractData: false,
        finalValues: null,
        futuresList: [],
      });
    } else {
      await this.setState({
        loadingData: true,
        contractName: "",
        finalValues: null,
        isContractData: false,
        futuresList: [],
      });
      await this.getFutureData(value.label);
      await this.setState({
        symbolName: value.label,
        isContractData: true,
        loadingData: false,
        contractName: this.state.futuresList[0],
        finalValues: this.state.contractData.filter(
          (i) => i.metadata.identifier === this.state.futuresList[0]
        ),
      });
    }
  }

  handleChangeContract = (value) => {
    if (!value || value.label === "None") {
      this.setState({
        contractName: "",
        finalValues: null,
      });
    } else {
      this.setState({
        contractName: value.label,
        finalValues: this.state.contractData.filter(
          (i) => i.metadata.identifier === value.label
        ),
      });
    }
  };

  handleChangePercent = (event) => {
    const num = event.target.value;
    if (!isNaN(parseFloat(num)) && isFinite(num) && num <= 100) {
      this.setState({ percentValue: num });
    }
  };

  render() {
    return (
      <div className="sentimentanalysis">
        {!this.state.loading ? (
          <>
            {this.state.message !== "" ? (
              <Alert variant="danger" className="row spotfuturespread__alert">
                {this.state.message}
                <div className="spinner-border text-warning" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </Alert>
            ) : null}

            {this.state.loadingData ? <CommonLoading /> : null}

            {/* <div className="row d-flex justify-content-center">
              <InputGroup
                size="lg"
                className="sentimentanalysis__enctoken"
                onChange={this.handleChangeEnctoken}
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-lg">
                    Encryption Token
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                />
              </InputGroup>
            </div> */}

            <div className="row d-flex justify-content-center">
              <Form.Group>
                <Form.Label>Select Symbol:</Form.Label>
                <Select
                  className="sentimentanalysis__select-symbol"
                  inputId="select_symbol"
                  TextFieldProps={{
                    label: "Select symbol: ",
                    InputLabelProps: {
                      htmlFor: "select_symbol",
                      shrink: true,
                    },
                    placeholder: "Select symbol",
                  }}
                  options={[
                    { label: "None" },
                    ...this.state.symbolList.map((i) => {
                      return {
                        label: i,
                      };
                    }),
                  ]}
                  isClearable={true}
                  onChange={this.handleChangeSymbol}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Select Contract:</Form.Label>
                <Select
                  className="sentimentanalysis__select-contract"
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
                    ...this.state.futuresList.map((i) => {
                      return {
                        label: i,
                      };
                    }),
                  ]}
                  onChange={this.handleChangeContract}
                  isDisabled={!this.state.isContractData}
                  isClearable={true}
                />
              </Form.Group>
            </div>

            {this.state.finalValues ? (
              <>
                <div className="row d-flex justify-content-center">
                  <p className="display-4 text-primary m-7">NIFTY</p>
                  <p className="display-4 text-secondary m-7">
                    {this.state.finalValues[0].metadata.identifier}
                  </p>
                  <TextField
                    id="outlined-name"
                    label="Percent Value"
                    className="sentimentanalysis__percent-input"
                    value={this.state.percentValue}
                    onChange={this.handleChangePercent}
                    margin="normal"
                    variant="outlined"
                  />
                  <p className="display-4 text-primary m-7">
                    {(
                      (this.state.percentValue / 100) *
                      this.state.finalValues[0].metadata.lastPrice
                    ).toLocaleString("hi-IN")}
                  </p>
                </div>

                <div className="row d-flex justify-content-center mt-10">
                  <p className="display-3 text-secondary m-7">
                    Low to CMP:{" "}
                    <span className="text-primary">
                      {" "}
                      {(
                        this.state.finalValues[0].metadata.lastPrice -
                        this.state.finalValues[0].metadata.lowPrice
                      ).toLocaleString("hi-IN")}
                    </span>
                  </p>
                  <p className="display-3 text-secondary m-7">
                    High to CMP:{" "}
                    <span className="text-primary">
                      {" "}
                      {(
                        this.state.finalValues[0].metadata.highPrice -
                        this.state.finalValues[0].metadata.lastPrice
                      ).toLocaleString("hi-IN")}
                    </span>
                  </p>
                </div>

                <div className="row d-flex justify-content-center mt-20">
                  <p className="display-2 text-secondary">
                    Sentiment:
                    {this.state.finalValues[0].metadata.lastPrice -
                      this.state.finalValues[0].metadata.lowPrice >
                    (this.state.percentValue / 100) *
                      this.state.finalValues[0].metadata.lastPrice ? (
                      <span className="text-danger mr-5 ml-5">Bearish</span>
                    ) : (
                      <span className="text-secondary mr-5 ml-5">Unknown</span>
                    )}
                    {this.state.finalValues[0].metadata.highPrice -
                      this.state.finalValues[0].metadata.lastPrice >
                    (this.state.percentValue / 100) *
                      this.state.finalValues[0].metadata.lastPrice ? (
                      <span className="text-success mr-5 ml-5">Bullish</span>
                    ) : (
                      <span className="text-secondary mr-5 ml-5">Unknown</span>
                    )}
                  </p>
                </div>
              </>
            ) : null}
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
    );
  }
}
