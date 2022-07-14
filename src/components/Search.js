import React from "react";

export default class Search extends React.Component {
    render() {
        return (
            <input
                className="search"
                placeholder="Search..."
                defaultValue={this.props.searchValues}
                onChange={(e) => this.props.handleSearch(e)}>                  
                </input>
        );
    }
}