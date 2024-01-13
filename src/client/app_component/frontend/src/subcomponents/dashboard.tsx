import React, { ReactNode, useState } from "react";

export class Dashboard extends React.Component {
  public render = (): ReactNode => {
    return (
      <div className="dashboard">
        <div className="pagetitle">
          <h1>Dashboard</h1>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-4">
              <div className="card info-card card-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    Revenue <span>| This Month</span>
                  </h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="fas fa-search"></i>
                    </div>
                    <div className="ps-3">
                      <h6>$3,264</h6>
                      <span className="text-success small pt-1 fw-bold">
                        8%
                      </span>

                      <span className="text-muted small pt-2 ps-1">
                        increase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card info-card card-success">
                <div className="card-body">
                  <h5 className="card-title">
                    Revenue <span>| This Month</span>
                  </h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="fas fa-save"></i>
                    </div>
                    <div className="ps-3">
                      <h6>$3,264</h6>
                      <span className="text-success small pt-1 fw-bold">
                        8%
                      </span>

                      <span className="text-muted small pt-2 ps-1">
                        increase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
}
