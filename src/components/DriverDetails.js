import React from "react";
import Loader from "./Loader";
import Flag from 'react-flagkit';
import Breadcrumb from "./Breadcrumb";

export default class DriverDetails extends React.Component {
  state = {
    driverDetails: [],
    racesDetails: [],
    selectedYear: "",
    isLoading: true,
    flags: []
  };

  componentDidMount() {
    this.getDriverDetails();
  }

  componentDidUpdate() {
    this.getDriverDetails();
  }

  getDriverDetails = async () => {
    const year = localStorage.getItem("chosen");
    if (year === this.state.selectedYear) {
      return;
    }
    const driverId = this.props.match.params.driverId;
    const url = `http://ergast.com/api/f1/${year}/drivers/${driverId}/driverStandings.json`;
    const urlRaces = `https://ergast.com/api/f1/${year}/drivers/${driverId}/results.json`;
    const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
    const response = await fetch(url);
    const responseRaces = await fetch(urlRaces);
    const responseFlags = await fetch(urlFlags);
    const drivers = await response.json();
    const races = await responseRaces.json();
    const flags = await responseFlags.json();
    const driverDetails = drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const racesDetails = races.MRData.RaceTable.Races;
    this.setState({
      driverDetails: driverDetails,
      racesDetails: racesDetails,
      selectedYear: year,
      isLoading: false,
      flags: flags
    });
  };

  changeColor = (position) => {

    let color = "";
    switch (position) {
      case "1":
        color = "yellow";
        break;
      case "2":
        color = "gray";
        break;
      case "3":
        color = "orange";
        break;
      case "4":
        color = "lightgreen";
        break;
      case "5":
        color = "lightblue";
        break;
      default:
        color = "darkgray";
        break;
    }
    return color;
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
      },
      {
        title: this.state.driverDetails[0].Driver.familyName,
        url: "/driverDetails/:driverId"
      }
    ];


    const fallbackSrc = "/img/avatar.png";

    return (
      <>
        <div className="top-level-background">
          <Breadcrumb breadcrumb={breadcrumb} />
          <div className="table-container">
            <div className="table-small-container">
              {this.state.driverDetails.map((driverDetail, i) => {
                return (
                  <div className="master" key={i}>
                    <div className="img-div">
                      <img src={`/img/drivers/${driverDetail.Driver.driverId}.jpg`}
                        onError={(e) => {
                          e.target.onError = null;
                          e.target.src = fallbackSrc;
                        }} />
                    </div>
                    <table className="table-small">
                      <tbody>
                        <tr>
                          <th colSpan="2">
                            <div className="image-container">
                              <div className="flag-name-container">
                                <div className="flag-div">
                                  {this.state.flags.map((flag, i) => {
                                    if (driverDetail.Driver.nationality === flag.nationality) {
                                      return (<Flag className="flag-size" key={i} country={flag.alpha_2_code} />);
                                    } else if (driverDetail.Driver.nationality === "British" && flag.nationality === "British, UK") {
                                      return (<Flag className="flag-size" key={i} country="GB" />);
                                    } else if (driverDetail.Driver.nationality === "Dutch" && flag.nationality === "Dutch, Netherlandic") {
                                      return (<Flag className="flag-size" key={i} country="NL" />);
                                    }
                                  })}
                                </div>
                                <div className="name-div">
                                  {driverDetail.Driver.givenName} {driverDetail.Driver.familyName}
                                </div>
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th>Nationality: </th>
                          <td>{driverDetail.Driver.nationality}</td>
                        </tr>
                        <tr>
                          <th>Team: </th>
                          <td>{driverDetail.Constructors[0].name}</td>
                        </tr>
                        <tr>
                          <th>Birth: </th>
                          <td>{driverDetail.Driver.dateOfBirth}</td>
                        </tr>
                        <tr>
                          <th>Biography: </th>
                          <td><a href={driverDetail.Driver.url} target="_blank" style={{ color: "white" }} ><img src={"/img/link-white.png"} width={16} height={16} /></a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
            <div className="background-details">
              <table className="table-details">
                <thead>
                  <tr>
                    <th className="title-small" colSpan="5" >Formula1 {this.state.selectedYear} Results</th>
                  </tr>
                  <tr className="subtitle-details">
                    <th>Round</th>
                    <th>Grand Prix</th>
                    <th>Teams</th>
                    <th>Grid</th>
                    <th>Race</th>
                  </tr>
                </thead>
                {this.state.racesDetails.map((raceDetail, i) => {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>{raceDetail.round}</td>
                        <td>
                          <div className="flag-container">
                            <div className="flag">
                              {this.state.flags.map((flag, i) => {
                                if (raceDetail.Circuit.Location.country === flag.en_short_name) {
                                  return (<Flag className="flag-size" key={i} country={flag.alpha_2_code} />);
                                } else if (raceDetail.Circuit.Location.country === "UK" && flag.en_short_name === "United Kingdom of Great Britain and Northern Ireland") {
                                  return (<Flag className="flag-size" key={i} country="GB" />);
                                } else if (raceDetail.Circuit.Location.country === "Korea" && flag.en_short_name === "Korea (Democratic People's Republic of)") {
                                  return (<Flag className="flag-size" key={i} country="KR" />);
                                } else if (raceDetail.Circuit.Location.country === "UAE" && flag.en_short_name === "United Arab Emirates") {
                                  return (<Flag className="flag-size" key={i} country="AE" />);
                                } else if (raceDetail.Circuit.Location.country === "USA" && flag.en_short_name === "United States of America") {
                                  return (<Flag className="flag-size" key={i} country="US" />);
                                }
                              })}
                            </div>
                            <div className="flag-text">
                              {raceDetail.raceName}
                            </div>
                          </div>
                        </td>
                        <td>{raceDetail.Results[0].Constructor.name}</td>
                        <td>{raceDetail.Results[0].grid}</td>
                        <td className="demo" style={{ "backgroundColor": this.changeColor(raceDetail.Results[0].position) }} >
                          {raceDetail.Results[0].position}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
