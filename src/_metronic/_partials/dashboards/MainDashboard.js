import React from "react";

export function MainDashboard() {
  return (
    <div className="card-stretch gutter-b">
      <div className="row">
        <div className="col-lg-6 col-xxl-3">
          <div className="col bg-light-success px-6 py-8 rounded-xl mb-7 shadow">
            <p className="text-success font-weight-bold font-size-h6 mt-2">
              Market Status: Open
            </p>
          </div>
        </div>

        <div className="col-lg-6 col-xxl-3">
          <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7 shadow">
            <p className="text-primary font-weight-bold font-size-h6 mt-2">
              Nifty 50
            </p>
          </div>
        </div>

        <div className="col-lg-6 col-xxl-3">
          <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7 shadow">
            <p className="text-primary font-weight-bold font-size-h6 mt-2">
              Nifty 500
            </p>
          </div>
        </div>

        <div className="col-lg-6 col-xxl-3">
          <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7 shadow">
            <p className="text-warning font-weight-bold font-size-h6">Gold</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card card-custom card-stretch gutter-b rounded-xl shadow">
            {/* Head */}
            <div className="card-header border-0 py-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label font-weight-bolder text-dark">
                  Gainers / Losers
                </span>
              </h3>
              <div className="card-toolbar">
                <p className="btn btn-outline-success font-weight-bolder font-size-sm mr-3">
                  Gainers
                </p>
                <p className="btn btn-outline-danger font-weight-bolder font-size-sm">
                  Losers
                </p>
              </div>
            </div>
            {/* Body */}
            <div className="card-body pt-0 pb-3">
              <div className="tab-content">
                <div className="table-responsive">
                  <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                    <thead>
                      <tr className="text-left text-uppercase">
                        <th className="pl-7" style={{ minWidth: "250px" }}>
                          <span className="text-dark-75">Symbol</span>
                        </th>
                        <th style={{ minWidth: "130px" }}>LTP</th>
                        <th style={{ minWidth: "130px" }}>% change</th>
                        <th style={{ minWidth: "130px" }}>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="pl-0 py-8">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                Stock 1
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1000.00
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1.5
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            10,00,000
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="pl-0 py-8">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                Stock 2
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1000.00
                          </span>
                        </td>

                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1.5
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            10,00,000
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="pl-0 py-8">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                Stock 3
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1000.00
                          </span>
                        </td>

                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1.5
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            10,00,000
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="pl-0 py-8">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                Stock 4
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1000.00
                          </span>
                        </td>

                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1.5
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            10,00,000
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="pl-0 py-8">
                          <div className="d-flex align-items-center">
                            <div>
                              <p className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                Stock 5
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1000.00
                          </span>
                        </td>

                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            1.5
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                            10,00,000
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
