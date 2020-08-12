import React from "react";

const InfoCard = (props) => {
  const j = props.data;
  return (
    <div className="col-lg-3 col-xxl-3 mb-3 animate__animated animate__fadeIn" key={j.index}>
      {j.variation < 0 ? (
        <div className="col bg-light-danger px-6 py-8 rounded-xl shadow dashboard__index">
          <div className="row">
            <p className="text-danger font-weight-bolder h1 dashboard__index-title">
              {j.index}
            </p>
            <p className="text-secondary font-weight-bold h1 mt-2 dashboard__index-value">
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
            <p className="text-warning font-weight-bold dashboard__index-ohlc">
              {j.open.toLocaleString("hi-IN")}{" "}
              <span className="text-info"> | </span>
              {j.high.toLocaleString("hi-IN")}{" "}
              <span className="text-info"> | </span>
              {j.low.toLocaleString("hi-IN")}
              <span className="text-info"> | </span>
              {j.previousClose.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row m-0">
            <pre className="text-muted dashboard__index-ohlc-title">
              {"Open     High      Low     Close"}
            </pre>
          </div>
        </div>
      ) : (
        <div className="col bg-light-success px-6 py-8 rounded-xl shadow dashboard__index">
          <div className="row">
            <p className="text-success font-weight-bolder h1 dashboard__index-title">
              {j.index}
            </p>
            <p className="text-secondary font-weight-bold h1 mt-2 dashboard__index-value">
              {j.last.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row">
            <p className="text-success h3 dashboard__index-data">
              {j.variation.toLocaleString("hi-IN")} /{" "}
              {j.percentChange.toLocaleString("hi-IN")}%
            </p>
          </div>
          <div className="row">
            <p className="text-warning font-weight-bold dashboard__index-ohlc">
              {j.open.toLocaleString("hi-IN")}{" "}
              <span className="text-info"> | </span>
              {j.high.toLocaleString("hi-IN")}{" "}
              <span className="text-info"> | </span>
              {j.low.toLocaleString("hi-IN")}
              <span className="text-info"> | </span>
              {j.previousClose.toLocaleString("hi-IN")}
            </p>
          </div>
          <div className="row m-0">
            <pre className="text-muted dashboard__index-ohlc-title">
              {"Open     High      Low     Close"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
