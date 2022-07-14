import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

export default class Loader extends React.Component {

    render() {
        return(
            <div className="loadr-container">
                <PulseLoader size={12} color="coral" />
            </div>
        )
    };
}