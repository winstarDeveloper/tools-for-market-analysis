import React from "react";

const HMInfoCard = (props) => {
  const i = props.data;
  return (
    <div
      className="col-lg-3 col-xxl-3 mb-3 animate__animated animate__fadeIn"
      key={i.symbol}
    >
      {i.pchange > 0 ? (
        <div className="col bg-light-success px-6 py-8 rounded-xl shadow heatmap__index">
          <div className="row mb-3">
            <p className="text-success font-weight-bolder h1 heatmap__index-title">
              {i.symbol}
            </p>
            <p className="text-secondary font-weight-bold h1 heatmap__index-value">
              {i.currentPrice.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row text-success d-flex justify-content-center heatmap__index-percent">
            {i.pchange.toLocaleString("hi-IN", {
              maximumFractionDigits: 2,
            })}
            %{"  |  " + i.change.toLocaleString("hi-IN")}
          </div>
          {props.trueRange ? (
            <div className="row text-primary h3 d-flex justify-content-center animate__animated animate__bounceIn">
              True Range:{" "}
              {i.trueRangePercent.toLocaleString("hi-IN", {
                maximumFractionDigits: 2,
              })}
              % | {i.trueRange.toLocaleString("hi-IN")}
            </div>
          ) : null}
          <div className="row d-flex justify-content-center">
            <p className="text-warning heatmap__index-ohlc">
              {i.open.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.high.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.low.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.close.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <pre className="text-muted heatmap__index-ohlc-title">
              {"Open     High      Low     Close"}
            </pre>
          </div>
        </div>
      ) : (
        <div className="col bg-light-danger px-6 py-8 rounded-xl shadow heatmap__index">
          <div className="row mb-3">
            <p className="text-danger font-weight-bolder h1 heatmap__index-title">
              {i.symbol}
            </p>
            <p className="text-secondary font-weight-bold h1 heatmap__index-value">
              {i.currentPrice.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row text-danger d-flex justify-content-center heatmap__index-percent">
            {i.pchange.toLocaleString("hi-IN", {
              maximumFractionDigits: 2,
            })}
            %{"  |  " + i.change.toLocaleString("hi-IN")}
          </div>
          {props.trueRange ? (
            <div className="row text-primary h3 d-flex justify-content-center animate__animated animate__bounceIn">
              True Range:{" "}
              {i.trueRangePercent.toLocaleString("hi-IN", {
                maximumFractionDigits: 2,
              })}
              % | {i.trueRange.toLocaleString("hi-IN")}
            </div>
          ) : null}
          <div className="row d-flex justify-content-center">
            <p className="text-warning heatmap__index-ohlc">
              {i.open.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.high.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.low.toLocaleString("hi-IN")}{" "}
              <span className="text-info">|</span>{" "}
              {i.close.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <pre className="text-muted heatmap__index-ohlc-title">
              {"Open     High      Low     Close"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default HMInfoCard;
