import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { Modal } from "react-bootstrap";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);

export default class PageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {}

  closeModal = () => this.setState({ show: false });

  getBodyText = (page) => {
    switch (page) {
      case "Dashboard":
        return (
          <>
            <p className="h2 text-center">
              Welcome to Financial Wizard's - Tools for Analysis
            </p>

            <p className="text-justify lead">
              This website provides Free Capital Market Analysis tools.
              Developed by Prayush Kale with help from his friend Himanshu
              Chaudhary who is a Retail Trader by profession.
            </p>

            <p className="text-justify lead">
              {/* 
              The website was created as result of requirements specified by
              Himanshu. He needed some specific Market data visualized in a
              proper way, which was not freely available online. 
              */}
              All data here is as provided by NSE. I do not take any liability
              for the data provided here, your market decisions based on data
              given here is your own Risk. The data is Live and refreshes
              automatically about every 30 seconds.
            </p>

            <p className="text-center lead">
              <b>** Important Note **</b>
            </p>

            <p className="text-center lead">
              You need to have CORS disabled on your Browser for this page to
              work. Install this Extension for Chrome and <b>Turn it ON: </b>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
              >
                Click here
              </a>
              <br />
              For other browsers just search for "allow cors plugin [browser
              name]".
              <br />
              Once done make sure to disable or uninstall the Extension or
              Plugin.
            </p>

            <p className="text-center lead">
              If you have any Questions/Queries/Feedback please provide it in
              the Feedback section, or you can contact me at{" "}
              <b>"prayushkale@gmail.com"</b>
            </p>

            <p className="text-center lead">Thanks</p>
          </>
        );

      case "View All Indices":
        return (
          <p className="text-center lead">
            This page provides LTP and OHLC of all Indices on NSE.
          </p>
        );

      case "View Commodities Spot":
        return (
          <p className="text-center lead">
            This page provides Spot prices of Commodities.
          </p>
        );

      case "HeatMap":
        return (
          <>
            <p className="text-center lead">
              This page provides a sorted list of Stocks based on the Options
              selected.
            </p>
          </>
        );

      case "NIFTY Weightage":
        return (
          <>
            <p className="text-center lead">
              This page displays Weightage distribution for the selected Index.{" "}
              <br />
              You need to have CORS disabled on your Browser for this page to
              work. Install this Extension for Chrome and Turn it ON:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
              >
                Click here
              </a>
              <br />
              For other browsers just search for "allow cors plugin [browser
              name]".
              <br />
              Once done make sure to disable or uninstall the Extension or
              Plugin.
            </p>
          </>
        );

      case "Spot and Future Spread":
        return (
          <>
            <p className="text-center lead">
              This page shows the Premium/Discount between Spot and Future price
              for the selected Contract. Min/Max values are correct only from
              the point you load the page.
            </p>
          </>
        );

      case "OI and Volume Analysis":
        return (
          <>
            <p className="text-center lead">
              This page displays Option Chain data in concise form. Contracts
              can be sorted by OI and Volume.
            </p>
          </>
        );

      case "Option Greeks Calculator":
        return (
          <>
            <p className="text-center lead">
              This page calculates Option Greeks based on 'Black & Scholes
              Option Pricing Formula'. Interest rate is 91-days T-bill interest
              as provided on RBI which can be updated. Volatility is auto
              updated and is as per data on NSE Option Chain.
            </p>
          </>
        );

      default:
        return <p className="text-center lead">This Page has no Info</p>;
    }
  };

  render() {
    return (
      <>
        <LightTooltip title="Click here for Page Info">
          <Button
            variant="outlined"
            className="mr-5"
            onClick={() => this.setState({ show: true })}
          >
            About
          </Button>
        </LightTooltip>

        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.closeModal}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              {"'" + this.props.pageName + "' Information"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getBodyText(this.props.pageName)}</Modal.Body>
        </Modal>
      </>
    );
  }
}
