import React, { Component } from "react";
import { Alert, Table } from "react-bootstrap";
import { BoxLoading } from "react-loadingg";
import Chart from "chart.js";

import * as NseURL from "../../../app/utils/NSE_Urls";

class NiftyWeightage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: "",
      stockList: [],
      //   marketCapList: [],
      marketCapList: [
        {
          symbol: "DRREDDY",
          marketCap: 7480014.03,
          weightage: 0.8788698608099786,
        },
        {
          symbol: "WIPRO",
          marketCap: 16223367.7,
          weightage: 1.9061767605224804,
        },
        { symbol: "VEDL", marketCap: 4161401.64, weightage: 0.488947008047419 },
        {
          symbol: "SUNPHARMA",
          marketCap: 12265095.49,
          weightage: 1.4410965972636547,
        },
        {
          symbol: "HINDUNILVR",
          marketCap: 51511139.12,
          weightage: 6.052339940404877,
        },
        {
          symbol: "HEROMOTOCO",
          marketCap: 5416078.22,
          weightage: 0.6363661742152317,
        },
        {
          symbol: "SBIN",
          marketCap: 16675636.65,
          weightage: 1.9593164401462064,
        },
        {
          symbol: "MARUTI",
          marketCap: 18910211.76,
          weightage: 2.2218695193274156,
        },
        {
          symbol: "COALINDIA",
          marketCap: 7934512.72,
          weightage: 0.9322715254080085,
        },
        {
          symbol: "BAJAJFINSV",
          marketCap: 9842641.39,
          weightage: 1.156468535184263,
        },
        {
          symbol: "POWERGRID",
          marketCap: 9272992.65,
          weightage: 1.0895372290628518,
        },
        {
          symbol: "BHARTIARTL",
          marketCap: 30021932.12,
          weightage: 3.527449440298848,
        },
        {
          symbol: "TATAMOTORS",
          marketCap: 3189365.55,
          weightage: 0.37473689832111734,
        },
        {
          symbol: "GRASIM",
          marketCap: 3959994.94,
          weightage: 0.4652825767127632,
        },
        {
          symbol: "AXISBANK",
          marketCap: 12050044.97,
          weightage: 1.4158290750609572,
        },
        {
          symbol: "BPCL",
          marketCap: 9062976.28,
          weightage: 1.0648611980915947,
        },
        { symbol: "ONGC", marketCap: 9768586.8, weightage: 1.1477674355680583 },
        {
          symbol: "BRITANNIA",
          marketCap: 9170852.52,
          weightage: 1.0775361978513887,
        },
        { symbol: "IOC", marketCap: 8369187.28, weightage: 0.983343938977377 },
        { symbol: "HDFC", marketCap: 31308733.22, weightage: 3.67864310104752 },
        {
          symbol: "CIPLA",
          marketCap: 5536917.74,
          weightage: 0.6505643042851488,
        },
        {
          symbol: "RELIANCE",
          marketCap: 133247943.1,
          weightage: 15.656067052258317,
        },
        {
          symbol: "ASIANPAINT",
          marketCap: 16738001.44,
          weightage: 1.966644037940397,
        },
        {
          symbol: "HCLTECH",
          marketCap: 18887109.07,
          weightage: 2.2191550514316063,
        },
        {
          symbol: "UPL",
          marketCap: 3534716.01,
          weightage: 0.41531410973991223,
        },
        {
          symbol: "TITAN",
          marketCap: 9232976.06,
          weightage: 1.0848354497958161,
        },
        {
          symbol: "INDUSINDBK",
          marketCap: 3613825.84,
          weightage: 0.4246091785729317,
        },
        {
          symbol: "TECHM",
          marketCap: 6503052.06,
          weightage: 0.764080981117123,
        },
        {
          symbol: "NESTLEIND",
          marketCap: 15947159.43,
          weightage: 1.8737234625960506,
        },
        {
          symbol: "ICICIBANK",
          marketCap: 22368448.41,
          weightage: 2.628197629280635,
        },
        { symbol: "NTPC", marketCap: 8583528.44, weightage: 1.008528114394632 },
        {
          symbol: "ULTRACEMCO",
          marketCap: 11957778.33,
          weightage: 1.4049881369652564,
        },
        {
          symbol: "KOTAKBANK",
          marketCap: 27282765.35,
          weightage: 3.2056089854240297,
        },
        { symbol: "LT", marketCap: 12788352.92, weightage: 1.502577121608592 },
        {
          symbol: "TCS",
          marketCap: 85591895.14,
          weightage: 10.056683940224387,
        },
        {
          symbol: "HDFCBANK",
          marketCap: 57672631.13,
          weightage: 6.7762890671701514,
        },
        {
          symbol: "HINDALCO",
          marketCap: 3618764.4,
          weightage: 0.42518943838559964,
        },
        {
          symbol: "EICHERMOT",
          marketCap: 5780281.9,
          weightage: 0.6791585588637511,
        },
        {
          symbol: "INFY",
          marketCap: 40980820.15,
          weightage: 4.815072211984777,
        },
        { symbol: "ZEEL", marketCap: 1345666.77, weightage: 0.158110126813026 },
        {
          symbol: "SHREECEM",
          marketCap: 7714063.92,
          weightage: 0.906369728246309,
        },
        {
          symbol: "TATASTEEL",
          marketCap: 4128586.62,
          weightage: 0.48509138265096813,
        },
        {
          symbol: "GAIL",
          marketCap: 4361307.18,
          weightage: 0.5124350594615342,
        },
        {
          symbol: "INFRATEL",
          marketCap: 3558646.27,
          weightage: 0.4181258135938082,
        },
        {
          symbol: "ITC",
          marketCap: 23794281.87,
          weightage: 2.7957270014853566,
        },
        {
          symbol: "BAJFINANCE",
          marketCap: 19402104.82,
          weightage: 2.2796648634860937,
        },
        {
          symbol: "ADANIPORTS",
          marketCap: 6344144.87,
          weightage: 0.7454100615978712,
        },
        {
          symbol: "JSWSTEEL",
          marketCap: 5172851.74,
          weightage: 0.6077880964515324,
        },
        { symbol: "M&M", marketCap: null, weightage: 0 },
        {
          symbol: "BAJAJ-AUTO",
          marketCap: 8811225.76,
          weightage: 1.0352815818523937,
        },
      ],
      totalMarketCap: 851094611.7899998,
      //   totalMarketCap: 0.0,
    };
    this.getIndexData = this.getIndexData.bind(this);
    this.getMarketCap = this.getMarketCap.bind(this);
  }

  async getIndexData(indexName) {
    try {
      const index_data_url =
        NseURL.Nse_main_URL + NseURL.IndexDataURL + indexName;

      const response = await fetch(index_data_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          stockList: Data.data
            .filter((i) => i.symbol !== "NIFTY 50")
            .map((j) => j.symbol),
          timestamp: Data.timestamp,
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          indexData: [],
        });
      }
      console.log("Stock List: ", this.state.stockList);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async getMarketCap(stockName) {
    try {
      const quote_data_url =
        NseURL.Nse_main_URL + NseURL.QuoteInfoURL + stockName;

      const response = await fetch(quote_data_url);
      const Data = await response.json();

      if (Data) {
        this.setState({
          marketCapList: [
            ...this.state.marketCapList,
            {
              symbol: stockName,
              marketCap: Data.marketDeptOrderBook.tradeInfo.totalMarketCap,
              weightage: 0,
            },
          ],
        });
      } else {
        this.setState({
          loading: false,
          message: "Error Receiving Data",
          marketCapList: [],
        });
      }
      console.log("Market Cap: ", this.state.marketCapList);
    } catch (err) {
      this.setState({ loading: true, message: err.message });
      console.log("Error: ", err.message);
    }
  }

  async componentDidMount() {
    await this.setState({ loading: false });
    this.renderChart();
  }

  getTotalMarketCap = () => {
    let total = 0;
    this.state.marketCapList.map((i) => (total += i.marketCap));
    this.setState({ totalMarketCap: total });
  };

  getWeightage = () => {
    this.setState({
      marketCapList: this.state.marketCapList.map((i) => ({
        symbol: i.symbol,
        marketCap: i.marketCap,
        weightage: (i.marketCap * 100) / this.state.totalMarketCap,
      })),
    });
  };

  getTotalWeightage = () => {
    let w = 0;
    this.state.marketCapList.map((i) => (w += i.weightage));
    console.log("Percentage: ", w);
  };

  sortByWeightage = (a, b) => {
    let comparison = 0;
    if (a.weightage < b.weightage) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  };

  get_random_color = () => {
    function c() {
      var hex = Math.floor(Math.random() * 256).toString(16);
      return ("0" + String(hex)).substr(-2); // pad with zero
    }
    return "#" + c() + c() + c();
  };

  renderChart = () => {
    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: [...this.state.marketCapList.map((i) => i.symbol)],
        datasets: [
          {
            label: "NIFTY Weightage",
            data: [
              ...this.state.marketCapList.map((i) => i.weightage.toFixed(2)),
            ],
            backgroundColor: [
              ...this.state.marketCapList.map(
                (i) =>
                  "#" + (Math.random().toString(16) + "000000").substring(2, 8)
              ),
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  render() {
    return !this.state.loading ? (
      <div className="row niftyweightage">
        <div className="col-lg-4">
          <Table
            striped
            bordered
            hover
            className="niftyweightage__table bg-light"
          >
            <thead>
              <tr className="bg-light-dark niftyweightage__table-heading">
                <th className="text-center">SYMBOL</th>
                <th className="text-center">Weightage</th>
              </tr>
            </thead>
            <tbody>
              {this.state.marketCapList
                .sort(this.sortByWeightage)
                .map((i, index) => {
                  return (
                    <tr key={index} className="niftyweightage__table-data">
                      <td className="h3">{i.symbol}</td>
                      <td className="h3 text-center">
                        {i.weightage.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <div className="col-lg-8 niftyweightage__visual">
          <canvas id="myChart" width="100vw" height="70vh"></canvas>
        </div>
      </div>
    ) : (
      <>
        {this.state.message !== "" ? (
          <Alert variant="danger" className="row spotfuturespread__alert">
            {this.state.message + " - Check connection and reload the page"}
          </Alert>
        ) : null}
        <BoxLoading />
      </>
    );
  }
}

export default NiftyWeightage;
