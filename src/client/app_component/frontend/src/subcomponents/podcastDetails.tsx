import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';


export class PodcastDetails extends React.Component {
  public render = (): ReactNode => {
    return (
             <div>
              Woohoo, you are reading this text in a modal!
            </div>
        )
    }
}