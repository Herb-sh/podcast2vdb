import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

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
             <Link to="/searchPodcasts">
              <div className="card info-card card-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    &nbsp;
                  </h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="fas fa-search"></i>
                    </div>
                    <div className="ps-3">
                      <h6> Search Podcasts </h6>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </div>
            <div className="col-4">
              <Link to="/savedPodcasts">
                  <div className="card info-card card-success">
                    <div className="card-body">
                      <h5 className="card-title">
                          &nbsp;
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="fas fa-save"></i>
                        </div>
                        <div className="ps-3">
                          <h6> Saved Podcasts </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
            </div>
          </div>
        </section>
      </div>
    );
  };
}
