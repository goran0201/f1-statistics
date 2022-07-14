import React from "react";
import Loader from "./Loader";
import Flag from "react-flagkit";
import Breadcrumb from "./Breadcrumb";

export default class TeamDetails extends React.Component {

  state = {
    details1: [],
    details2: [],
    selectedYear: "",
    isLoading: true,
    flags: []
  };

  componentDidMount() {
    this.getDetails();
  };

  componentDidUpdate() {
    this.getDetails();
}

  getDetails = async () => {
    const year = localStorage.getItem("chosen");
        if (year === this.state.selectedYear) {
            return
        }
    const constructorId = this.props.match.params.constructorId;
    const urlDetails = `http://ergast.com/api/f1/${year}/constructors/${constructorId}/constructorStandings.json`;
    const urlResults = `http://ergast.com/api/f1/${year}/constructors/${constructorId}/results.json`;
    const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
    const response1 = await fetch(urlDetails);
    const response2 = await fetch(urlResults);
    const dataFlags = await fetch(urlFlags);
    const teams1 = await response1.json();
    const teams2 = await response2.json();
    const flags = await dataFlags.json();
    const details1 = teams1.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    const details2 = teams2.MRData.RaceTable.Races;
    this.setState({
      details1: details1,
      details2: details2,
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
        title: "Teams",
        url: "/teams"
      },
      {
        title: this.state.details1[0].Constructor.name,
        url: "/teams/details/:constructorId"
      }
    ];

    const fallbackSrc = "/img/rteam.jpg";

    return (
      <>
        <div className="top-level-background">
          <Breadcrumb breadcrumb={breadcrumb} />
          <div className="table-container">
            <div className="table-small-container">
              {this.state.details1.map((details1, seasons, i) => {
                return (
                  <div className="master" key={i}>
                    <div className="img-div">
                    <img src={`/img/teams/${details1.Constructor.constructorId}.png`}
                      onError={(e) => {
                        e.target.onError = null; 
                        e.target.src = fallbackSrc}} />
                    </div>
                    <table className="table-small">
                      <tbody>
                        <tr>
                          <th className="table-small-header" colSpan="2">
                            <div className="image-container">
                              <div className="flag-name-container">
                                <div className="flag-div">
                                  {this.state.flags.map((flag, index) => {
                                    if (details1.Constructor.nationality === flag.nationality) {
                                      return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                                    } else if (details1.Constructor.nationality === "British" && flag.nationality === "British, UK") {
                                      return (<Flag className="flag-size" key={index} country="GB" />);
                                    }
                                  })}
                                </div>
                                <div className="name-div">
                                  {details1.Constructor.name}
                                </div>
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <th>Nationality: </th>
                          <td>{details1.Constructor.nationality}</td>
                        </tr>
                        <tr>
                          <th>Position: </th>
                          <td>{details1.position}</td>
                        </tr>
                        <tr>
                          <th>Points: </th>
                          <td>{details1.points}</td>
                        </tr>
                        <tr>
                          <th>History: </th>
                          <td><a href={details1.Constructor.url} target="_blank" style={{ color: "white" }} ><img src={"/img/link-white.png"} width={16} height={16} /></a></td>
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
                    <th colSpan="5" className="title-small">Formula1 {this.state.selectedYear} Results</th>
                  </tr>
                  <tr className="subtitle-details">
                    <th>Round</th>
                    <th>Grand Prix</th>
                    <th>{this.state.details2[0].Results[0].Driver.familyName}</th>
                    <th>{this.state.details2[0].Results[1].Driver.familyName}</th>
                    <th>Points</th>
                  </tr>
                </thead>
                {this.state.details2.map((details2, i) => {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td>{details2.round}</td>
                        <td>
                          <div className="flag-container">
                            <div className="flag">
                              {this.state.flags.map((flag, index) => {
                                if (details2.Circuit.Location.country === flag.en_short_name) {
                                  return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                                } else if (details2.Circuit.Location.country === "UK" && flag.nationality === "British, UK") {
                                  return (<Flag className="flag-size" key={index} country="GB" />);
                                } else if (details2.Circuit.Location.country === "Korea" && flag.en_short_name === "Korea (Democratic People's Republic of)") {
                                  return (<Flag className="flag-size" key={index} country="KR" />);
                                }
                              })}
                            </div>
                            <div className="flag-text">
                              {details2.raceName}
                            </div>
                          </div>
                        </td>
                        <td style={{ "backgroundColor": this.changeColor(details2.Results[0].position) }}>{details2.Results[0].position}</td>
                        <td style={{ "backgroundColor": this.changeColor(details2.Results[0].position) }}>{details2.Results[1].position}</td>
                        <td>{parseInt(details2.Results[0].points) + parseInt(details2.Results[1].points)}</td>
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