import React from "react";
import history from "./../history";
import Loader from "./Loader";
import Flag from 'react-flagkit';
import Breadcrumb from "./Breadcrumb";
import Search from "./Search";


export default class Drivers extends React.Component {
    state = {
        allDrivers: [],
        selectedYear: "",
        isLoading: true,
        flags: [],
        searchDrivers: [],
        filterValue: ""
    };

    componentDidMount() {
        this.getDrivers();
    }

    componentDidUpdate() {
        this.getDrivers();
    }

    getDrivers = async () => {
        const year = localStorage.getItem("chosen")
        if (year === this.state.selectedYear) {
            return
        }
        const url = `http://ergast.com/api/f1/${year}/driverStandings.json`;
        const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
        const response = await fetch(url);
        const responseFlags = await fetch(urlFlags);
        const drivers = await response.json();
        const flags = await responseFlags.json();
        const allDrivers = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        this.setState({
            allDrivers: allDrivers,
            selectedYear: year,
            isLoading: false,
            flags: flags,
            searchDrivers: drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings
        });
    };

    handleDrivers = (driverId) => {
        const linkTo = "/driverDetails/" + driverId;
        history.push(linkTo);
    };

    handleSearch = (item) => {
        if (item.target.value == "") {
            return this.setState({
                allDrivers: this.state.searchDrivers,
            });
        } else {
            const searchResults = this.state.searchDrivers.filter(
                (drivers) => drivers.Driver.givenName.toLowerCase().includes(item.target.value.toLowerCase()) ||
                    drivers.Driver.familyName.toLowerCase().includes(item.target.value.toLowerCase()) || 
                    drivers.Constructors[0].name.toLowerCase().includes(item.target.value.toLowerCase())
            );
            this.setState({
                allDrivers: searchResults,
            });
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <div className="loading-div">
                    <p className="loading">loading...</p>
                    <Loader />
                </div>
            );
        }

        const breadcrumb = [
            {
                title: "Drivers",
                url: "/drivers"
            }
        ];


        return (
            <>
                <div className="top-level-background">
                    <Breadcrumb breadcrumb={breadcrumb} />
                    <Search searchValues={this.state.searchValues} handleSearch={this.handleSearch} />
                    <div className="background">
                        <h1 className="title">Drivers Campionship</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th colSpan="4" className="title-small">Drivers Championship Standings - {this.state.selectedYear}</th>
                                    
                                </tr>
                            </thead>
                            {this.state.allDrivers.map((driver, i) => {
                                return (
                                    <tbody key={i} onClick={() => this.handleDrivers(driver.Driver.driverId)}>
                                        <tr>
                                            <td>{driver.position}</td>
                                            <td>
                                                <div className="flag-container">
                                                    <div className="flag">
                                                        {this.state.flags.map((flag, i) => {
                                                            if (driver.Driver.nationality === flag.nationality) {
                                                                return (<Flag className="flag-size" key={i} country={flag.alpha_2_code} />);
                                                            } else if (driver.Driver.nationality === "British" && flag.nationality === "British, UK") {
                                                                return (<Flag className="flag-size" key={i} country="GB" />);
                                                            } else if (driver.Driver.nationality === "Dutch" && flag.nationality === "Dutch, Netherlandic") {
                                                                return (<Flag className="flag-size" key={i} country="NL" />);
                                                            }
                                                        })}
                                                    </div>
                                                    <div className="flag-text">
                                                        {driver.Driver.givenName} {driver.Driver.familyName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{driver.Constructors[0].name}</td>
                                            <td>{driver.points}</td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </>
        );
    }
}