import React, { Component } from "react";
import { Table, Alert, Form } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import { BoxLoading, CommonLoading } from "react-loadingg";

import * as NseURL from "./../../../utils/NSE_Urls";

class OIVolumeAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      message: "",
      contractName: "",
      expiryDisabled: true,
      optionChainData: {},
      expiryDates: [],
      defaultExpiry: "",
      underlyingValue: 0,
      itm_calls: [],
      otm_calls: [],
      itm_put: [],
      otm_put: [],
      tablesSet: false,
      timestamp: "",
      sortBy: 'Open-Interest'
    };
    this.getSymbols = this.getSymbols.bind(this);
    this.getIndicesData = this.getIndicesData.bind(this);
    this.getEquitesData = this.getEquitesData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.handleChangeContract = this.handleChangeContract.bind(this);
    this.handleChangeExpiry = this.handleChangeExpiry.bind(this);
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

  async updateData(value) {
    if (value) {
      if (["NIFTY", "BANKNIFTY"].includes(value)) {
        await this.getIndicesData(value);
      } else {
        await this.getEquitesData(value);
      }
      this.setState({
        expiryDates: this.state.optionChainData.records.expiryDates,
        underlyingValue: this.state.optionChainData.records.underlyingValue,
        timestamp: this.state.optionChainData.records.timestamp,
      });
      this.setTables();
    }
  }

  async componentDidMount() {
    this.getSymbols();
    this.interval = setInterval(() => this.updateData(this.state.contractName), 5000);
  }

  async handleChangeContract(value) {
    this.setState({ tablesSet: false });
    if (value) {
      await this.setState({
        contractName: value.label,
        expiryDisabled: false,
      });
      // this.forceUpdate();

      if (["NIFTY", "BANKNIFTY"].includes(value.label)) {
        await this.getIndicesData(value.label);
      } else {
        await this.getEquitesData(value.label);
      }
      this.setState({
        expiryDates: this.state.optionChainData.records.expiryDates,
        underlyingValue: this.state.optionChainData.records.underlyingValue,
        timestamp: this.state.optionChainData.records.timestamp,
      });

      if (this.state.defaultExpiry === "") {
        this.setState({
          defaultExpiry: this.state.optionChainData.records.expiryDates[0],
        });
      }

      this.setTables();
    } else {
      this.setState({
        contractName: "",
        expiryDisabled: true,
        expiryDates: [],
        defaultExpiry: "",
        sortBy: 'Open-Interest'
      });
    }
  }

  async handleChangeExpiry(value) {
    await this.setState({ defaultExpiry: value.label });
    console.log(this.state);
    this.handleChangeContract({ label: this.state.contractName });
  }

  async setTables() {
    await this.setState({ tablesSet: false });

    const data = this.state.optionChainData.records.data;

    this.setState({
      itm_calls: data
        .filter(
          (i) =>
            i.expiryDate === this.state.defaultExpiry &&
            i.strikePrice <= this.state.underlyingValue &&
            i.CE
        )
        .map((j) => {
          return {
            strikePrice: j.CE.strikePrice,
            openInterest: j.CE.openInterest,
            changeinOpenInterest: j.CE.changeinOpenInterest,
            pchangeinOpenInterest: j.CE.pchangeinOpenInterest,
            volume: j.CE.totalTradedVolume,
          };
        })
        .sort(this.sortBy),
    });

    this.setState({
      otm_calls: data
        .filter(
          (i) =>
            i.expiryDate === this.state.defaultExpiry &&
            i.strikePrice > this.state.underlyingValue &&
            i.CE
        )
        .map((j) => {
          return {
            strikePrice: j.CE.strikePrice,
            openInterest: j.CE.openInterest,
            changeinOpenInterest: j.CE.changeinOpenInterest,
            pchangeinOpenInterest: j.CE.pchangeinOpenInterest,
            volume: j.CE.totalTradedVolume,
          };
        })
        .sort(this.sortBy),
    });

    this.setState({
      itm_puts: data
        .filter(
          (i) =>
            i.expiryDate === this.state.defaultExpiry &&
            i.strikePrice > this.state.underlyingValue &&
            i.PE
        )
        .map((j) => {
          return {
            strikePrice: j.PE.strikePrice,
            openInterest: j.PE.openInterest,
            changeinOpenInterest: j.PE.changeinOpenInterest,
            pchangeinOpenInterest: j.PE.pchangeinOpenInterest,
            volume: j.PE.totalTradedVolume,
          };
        })
        .sort(this.sortBy),
    });

    this.setState({
      otm_puts: data
        .filter(
          (i) =>
            i.expiryDate === this.state.defaultExpiry &&
            i.strikePrice <= this.state.underlyingValue &&
            i.PE
        )
        .map((j) => {
          return {
            strikePrice: j.PE.strikePrice,
            openInterest: j.PE.openInterest,
            changeinOpenInterest: j.PE.changeinOpenInterest,
            pchangeinOpenInterest: j.PE.pchangeinOpenInterest,
            volume: j.PE.totalTradedVolume,
          };
        })
        .sort(this.sortBy),
    });

    console.log("ITM Calls: ", this.state.itm_calls);
    console.log("OTM Calls: ", this.state.otm_calls);
    console.log("ITM Puts: ", this.state.itm_puts);
    console.log("OTM Puts: ", this.state.otm_puts);

    this.setState({ tablesSet: true });
    return true;
  };

  handleChangeSort = (value) => {
    this.setState({ sortBy: value.label});
    this.setTables();
    this.forceUpdate();
  }

  sortBy = (a,b) => {
    if(this.state.sortBy === 'Volume'){
      return this.sortByVolume(a,b);
    }else{
      return this.sortByOI(a,b);
    }
  } 

  sortByOI = (a, b) => {
    let comparison = 0;
    if (a.openInterest > b.openInterest) {
      comparison = -1;
    } else {
      comparison = 1;
    }
    return comparison;
  };

  sortByVolume = (a, b) => {
    let comparison = 0;
    if (a.volume > b.volume) {
      comparison = -1;
    } else {
      comparison = 1;
    }
    return comparison;
  };

  renderTable = (arr, tableId) => {
    let res = [];
    const l = arr.length > 3 ? 3 : arr.length;

    if (tableId === "itm_calls") {
      for (let i = 0; i < l; i++) {
        if (i === 0) {
          res.unshift(
            <tr key={i} className="bg-light-warning h5">
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td className="bg-light-danger">
                {arr[i].strikePrice.toLocaleString("hi-IN")}
              </td>
            </tr>
          );
        } else {
          res.unshift(
            <tr key={i}>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].strikePrice.toLocaleString("hi-IN")}</td>
            </tr>
          );
        }
      }
    } else if (tableId === "otm_calls") {
      for (let i = 0; i < l; i++) {
        if (i === 0) {
          res.push(
            <tr key={i} className="bg-light-warning h5">
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td className="bg-light-danger">
                {arr[i].strikePrice.toLocaleString("hi-IN")}
              </td>
            </tr>
          );
        } else {
          res.push(
            <tr key={i}>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].strikePrice.toLocaleString("hi-IN")}</td>
            </tr>
          );
        }
      }
    } else if (tableId === "otm_puts") {
      for (let i = 0; i < l; i++) {
        if (i === 0) {
          res.unshift(
            <tr key={i} className="bg-light-warning h5">
              <td className="bg-light-danger">
                {arr[i].strikePrice.toLocaleString("hi-IN")}
              </td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
            </tr>
          );
        } else {
          res.unshift(
            <tr key={i}>
              <td>{arr[i].strikePrice.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
            </tr>
          );
        }
      }
    } else if (tableId === "itm_puts") {
      for (let i = 0; i < l; i++) {
        if (i === 0) {
          res.push(
            <tr key={i} className="bg-light-warning h5">
              <td className="bg-light-danger">
                {arr[i].strikePrice.toLocaleString("hi-IN")}
              </td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
            </tr>
          );
        } else {
          res.push(
            <tr key={i}>
              <td>{arr[i].strikePrice.toLocaleString("hi-IN")}</td>
              <td>{arr[i].openInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].changeinOpenInterest.toLocaleString("hi-IN")}</td>
              <td>{arr[i].volume.toLocaleString("hi-IN")}</td>
            </tr>
          );
        }
      }
    }

    return res;
  };

  render() {
    return !this.state.loading ? (
      <div className="oivolume">
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message + " - Check connection and reload the page"}
          </Alert>
        ) : null}

        <div className="row d-flex justify-content-center">
          <div className="oivolume__form-contract">
            <Form.Group>
              <Form.Label>Select Contract:</Form.Label>
              <Select
                className="oivolume__select-contract"
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

          <div className="oivolume__form-expiry">
            <Form.Group>
              <Form.Label>Select Expiry:</Form.Label>
              <Select
                className="oivolume__select-expiry"
                inputId="select_expiry"
                TextFieldProps={{
                  label: "Select Expiry: ",
                  InputLabelProps: {
                    htmlFor: "select_expiry",
                    shrink: true,
                  },
                  placeholder: "Select Expiry",
                }}
                options={[
                  ...this.state.expiryDates.map((i) => {
                    return {
                      label: i,
                    };
                  }),
                ]}
                value={{ label: this.state.defaultExpiry }}
                onChange={this.handleChangeExpiry}
                isDisabled={this.state.expiryDisabled}
              />
            </Form.Group>
          </div>
        
          <div className="oivolume__form-sort">
            <Form.Group>
              <Form.Label>Sort by:</Form.Label>
              <Select
                className="oivolume__select-sort"
                inputId="select_sort"
                TextFieldProps={{
                  label: "Select Sort: ",
                  InputLabelProps: {
                    htmlFor: "select_sort",
                    shrink: true,
                  },
                  placeholder: "Select Sort",
                }}
                options={[{label: 'Open-Interest'},  {label: 'Volume'}]}
                defaultValue={{label: 'Open-Interest'}}
                onChange={this.handleChangeSort}
                isDisabled={this.state.expiryDisabled}
              />
            </Form.Group>
          </div>
        </div>

        {this.state.tablesSet ? (
          <>
            <div className="row d-flex justify-content-center">
              <p className="display-4 oivolume__contract-name">
                {this.state.contractName + "\t\t" + this.state.defaultExpiry}
              </p>
            </div>  
            <div className="row d-flex justify-content-center">
              <p className="text-muted oivolume__contract-timestamp">
                Last Updated - {this.state.timestamp}
              </p>
            </div>
            <div className="bg-light-primary px-6 py-8 rounded-xl mb-7 shadow">
              <div className="row oivolume__row">
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                  <p className="oivolume__calls-itm">ITM</p>
                  </Grid>
                  <Grid item xs={3}>
                    <p className="oivolume__calls-title">Calls</p>
                    <Table
                      variant="light"
                      striped
                      bordered
                      hover
                      className="oivolume__table-1"
                    >
                      <thead>
                        <tr className="bg-light-success">
                          <th>Volume</th>
                          <th>Change in OI</th>
                          <th>Open Interest</th>
                          <th>Strike Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderTable(this.state.itm_calls, "itm_calls")}
                      </tbody>
                    </Table>
                  </Grid>
                  <Grid item xs={3}>
                    <p className="oivolume__puts-title">Puts</p>
                    <Table
                      variant="light"
                      striped
                      bordered
                      hover
                      className="oivolume__table-2"
                    >
                      <thead>
                        <tr className="bg-light-success">
                          <th>Strike Price</th>
                          <th>Open Interest</th>
                          <th>Change in OI</th>
                          <th>Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderTable(this.state.otm_puts, "otm_puts")}
                      </tbody>
                    </Table>
                  </Grid>
                  <Grid item xs={3}>
                  <p className="oivolume__puts-otm">OTM</p>
                  </Grid>
                </Grid>
              </div>
              <div className="row oivolume__row">
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                  <p className="oivolume__calls-otm">OTM</p>
                  </Grid>
                  <Grid item xs={3}>
                    <Table variant="light" striped bordered hover>
                      <tbody>
                        {this.renderTable(this.state.otm_calls, "otm_calls")}
                      </tbody>
                      <tfoot>
                        <tr className="bg-light-success">
                          <th>Volume</th>
                          <th>Change in OI</th>
                          <th>Open Interest</th>
                          <th>Strike Price</th>
                        </tr>
                      </tfoot>
                    </Table>
                  </Grid>
                  <Grid item xs={3}>
                    <Table variant="light" striped bordered hover>
                      <tbody>
                        {this.renderTable(this.state.itm_puts, "itm_puts")}
                      </tbody>
                      <tfoot>
                        <tr className="bg-light-success">
                          <th>Strike Price</th>
                          <th>Open Interest</th>
                          <th>Change in OI</th>
                          <th>Volume</th>
                        </tr>
                      </tfoot>
                    </Table>
                  </Grid>
                  <Grid item xs={3}>
                  <p className="oivolume__puts-itm">ITM</p>
                  </Grid>
                </Grid>
              </div>
            </div>
          </>
        ) : this.state.contractName === "" ? null : (
          <CommonLoading />
        )}
      </div>
    ) : (
      <BoxLoading />
    );
  }
}

export default OIVolumeAnalysis;
