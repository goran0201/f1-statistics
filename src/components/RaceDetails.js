import React from "react";
import Loader from "./Loader";
import Flag from 'react-flagkit';
import Breadcrumb from "./Breadcrumb";

export default class RaceDetails extends React.Component {
  state = {
    qualifyngDetails: [],
    raceResults: [],
    raceLocation: [],
    selectedYear: "",
    flags: [],
    isLoading: true
  };

  componentDidMount() {
    this.getQualifiersDetails();
  }

  componentDidUpdate() {
    this.getQualifiersDetails();
  }

  getQualifiersDetails = async () => {
    const year = localStorage.getItem("chosen");
        if (year === this.state.selectedYear) {
            return
        }
    const raceId = this.props.match.params.raceId;
    const url = `http://ergast.com/api/f1/${year}/${raceId}/qualifying.json`;
    const urlResults = `http://ergast.com/api/f1/${year}/${raceId}/results.json`;
    const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
    const response = await fetch(url);
    const response2 = await fetch(urlResults);
    const responseFlags = await fetch(urlFlags);
    const flagsConvert = await responseFlags.json();
    const qualifiers = await response.json();
    const results = await response2.json();
    const qualifiersDetails = qualifiers.MRData.RaceTable.Races[0].QualifyingResults;
    const location = qualifiers.MRData.RaceTable.Races;
    const raceResults = results.MRData.RaceTable.Races[0].Results;
    this.setState({
      qualifyngDetails: qualifiersDetails,
      raceResults: raceResults,
      raceLocation: location,
      selectedYear: year,
      flags: flagsConvert,
      isLoading: false
    });
  };

  changeColor = (points) => {

    let color = "";
    switch (points) {
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
        color = "lightgray";
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
        title: "Races",
        url: "/races"
      },
      {
        title: this.state.raceLocation[0].raceName,
        url: "/raceDetails/:raceId"
      }
    ];

    return (
      <>
        <div className="top-level-background">
          <Breadcrumb breadcrumb={breadcrumb} />
          <div className="table-container">
            <div className="table-small-container">
              {this.state.raceLocation.map((location, i) => {
                return (
                  <div className="master"  key={i}>
                    <div className="flag-raceDetails">
                      {this.state.flags.map((flag, i) => {
                        if (location.Circuit.Location.country === flag.en_short_name) {
                          return (<Flag className="large-flag" key={i} country={flag.alpha_2_code} size={84} />);
                        } else if (location.Circuit.Location.country === "UK" && flag.en_short_name === "United Kingdom of Great Britain and Northern Ireland") {
                          return (<Flag className="large-flag" key={i} country="GB" size={84} />);
                        } else if (location.Circuit.Location.country === "UAE" && flag.en_short_name === "United Arab Emirates") {
                          return (<Flag className="large-flag" key={i} country="AE" size={84} />);
                        } else if (location.Circuit.Location.country === "Korea" && flag.en_short_name === "Korea (Democratic People's Republic of)") {
                          return (<Flag className="large-flag" key={i} country="KR" size={84} />);
                        } else if (location.Circuit.Location.country === "USA" && flag.en_short_name === "United States of America") {
                          return (<Flag className="large-flag" key={i} country="US" size={84} />);
                        }
                      })}
                    </div>
                    <table className="table-small">
                      <tbody>
                        <tr>
                          <th className="table-small-header" colSpan="2">
                            <div className="flag-container-raceDetails">
                              <div className="name-div-raceDetails">
                                {location.raceName}
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th>Country: </th>
                          <td>{location.Circuit.Location.country}</td>
                        </tr>
                        <tr>
                          <th>Location: </th>
                          <td>{location.Circuit.Location.locality}</td>
                        </tr>
                        <tr>
                          <th>Date: </th>
                          <td>{location.date}</td>
                        </tr>
                        <tr>
                          <th>Full report: </th>
                          <td><a href={location.Circuit.url} target="_blank" style={{ color: "white" }} ><img src={"/img/link-white.png"} width={16} height={16} /></a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
            <div className="background-details">
              <div className="master-race">
                <table className="table-details-race">
                  <thead>
                    <tr>
                      <th colSpan="4" className="title-small">Qualifying results - {this.state.selectedYear}</th>
                    </tr>
                    <tr className="subtitle-details">
                      <th>Pos</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Best time</th>
                    </tr>
                  </thead>
                  {this.state.qualifyngDetails.map((qualifying, i) => {
                    let times = [];
                    times.push(qualifying.Q1);
                    times.push(qualifying.Q2);
                    times.push(qualifying.Q3);
                    times.sort();
                    return (
                      <tbody key={i}>
                        <tr>
                          <td>{qualifying.position}</td>
                          <td>
                            <div className="flag-container">
                              <div className="flag">
                                {this.state.flags.map((flag, index) => {
                                  if (qualifying.Driver.nationality === flag.nationality) {
                                    return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                                  } else if (qualifying.Driver.nationality === "British" && flag.nationality === "British, UK") {
                                    return (<Flag className="flag-size" key={index} country="GB" />);
                                  } else if (qualifying.Driver.nationality === "Dutch" && flag.nationality === "Dutch, Netherlandic") {
                                    return (<Flag className="flag-size" key={index} country="NL" />);
                                  }
                                })}
                              </div>
                              <div className="flag-text">
                                {qualifying.Driver.familyName}
                              </div>
                            </div>
                          </td>
                          <td> {qualifying.Constructor.name}</td>
                          <td> {times[0]}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
                <table className="table-details-race">
                  <thead>
                    <tr>
                      <th colSpan="5" className="title-small">Race results - {this.state.selectedYear}</th>
                    </tr>
                    <tr className="subtitle-details">
                      <th>Pos</th>
                      <th>Driver</th>
                      <th>Team</th>
                      <th>Result</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  {this.state.raceResults.map((result, index) => {
                    return (
                      <tbody key={index}>
                        <tr>
                          <td>{result.position}</td>
                          <td>
                            <div className="flag-container">
                              <div className="flag">
                                {this.state.flags.map((flag, index) => {
                                  if (result.Driver.nationality === flag.nationality) {
                                    return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                                  } else if (result.Driver.nationality === "British" && flag.nationality === "British, UK") {
                                    return (<Flag className="flag-size" key={index} country="GB" />);
                                  } else if (result.Driver.nationality === "Dutch" && flag.nationality === "Dutch, Netherlandic") {
                                    return (<Flag className="flag-size" key={index} country="NL" />);
                                  }
                                })}
                              </div>
                              <div className="flag-text">
                                {result.Driver.familyName}
                              </div>
                            </div>
                          </td>
                          <td>{result.Constructor.name}</td>
                          {/* <td>{result.Time !== undefined ? result.Time.time: ""}</td> */}
                          <td>{result.Time?.time}</td>
                          <td style={{ "backgroundColor": this.changeColor(result.position) }}>{result.points}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}