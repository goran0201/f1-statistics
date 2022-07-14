import React from "react";
import Home from "./components/Home";
import Drivers from "./components/Drivers";
import DriverDetails from "./components/DriverDetails";
import Teams from "./components/Teams";
import TeamDetails from "./components/TeamDetails";
import Races from "./components/Races";
import RaceDetails from "./components/RaceDetails";
import { Router, Switch, Route, Link } from "react-router-dom";
import history from "./history";


const minOffset = 0;
const maxOffset = 72;

export default class App extends React.Component {

    constructor() {
        super();
        const thisYear = new Date().getFullYear();
        localStorage.setItem("chosen", thisYear);
        this.state = {
            thisYear: thisYear,
            selectedYear: ""
        };
    }

    selectYear = (e) => {
        const selectedYear = parseInt(e.target.value);
        localStorage.setItem("chosen", selectedYear);
        this.setState({
            selectedYear: selectedYear
        });
    };

    render() {
        const thisYear = this.state.thisYear;
        const options = [];
        for (let i = minOffset; i <= maxOffset; i++) {
            const year = thisYear - i;
            options.push(<option key={year} value={year}>{year}</option>);
        }

        return (

            <Router history={history}>
                <div className="main">
                    <div className="main-container">
                        <nav className="navigation">
                            <ul className="nav-list">
                                <li className="nav-link">
                                    <div className="devider-logo">
                                        <Link to="/">
                                            <img className="logo-img" src={`/img/F1-logo.png`} />
                                        </Link>
                                    </div>
                                    <div className="devider-links">
                                        <Link to="/drivers">Drivers</Link>
                                        <Link to="/teams">Teams</Link>
                                        <Link to="/races">Races</Link>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                        <div className="year-selector">
                            <select className="year-select" value={this.selectedYear} onChange={this.selectYear}>
                                {options}
                            </select>
                        </div>
                    </div>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/drivers" exact component={Drivers} />
                        <Route path="/teams" exact component={Teams} />
                        <Route path="/races" exact component={Races} />
                        <Route path="/driverDetails/:driverId" exact component={DriverDetails} />
                        <Route path="/teams/details/:constructorId" exact component={TeamDetails} />
                        <Route path="/raceDetails/:raceId" exact component={RaceDetails} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

