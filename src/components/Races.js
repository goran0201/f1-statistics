import React from "react";
import history from "./../history";
import Loader from "./Loader";
import Flag from 'react-flagkit';
import Breadcrumb from "./Breadcrumb";
import Search from "./Search";

export default class Races extends React.Component {
  state = {
    races: [],
    isLoading: true,
    flags: [],
    selectedYear: "",
    searchRaces: [],
    filterValue: ""
  };

  componentDidMount() {
    this.getRaces();
  }

  componentDidUpdate() {
    this.getRaces();
  }

  getRaces = async () => {
    const year = localStorage.getItem("chosen");
    if (year === this.state.selectedYear) {
      return;
    }
    const url = `http://ergast.com/api/f1/${year}/results/1.json`;
    const response = await fetch(url);
    const races = await response.json();
    const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
    const responseFlags = await fetch(urlFlags);
    const flagsConvert = await responseFlags.json();
    const allRaces = races.MRData.RaceTable.Races;
    this.setState({
      races: allRaces,
      selectedYear: year,
      isLoading: false,
      flags: flagsConvert,
      searchRaces: races.MRData.RaceTable.Races
    });
    console.log(year)
  };

  handleRaces = (raceId) => {
    const linkTo = "/raceDetails/" + raceId;
    history.push(linkTo);
  };

  handleSearch = (item) => {
    if (item.target.value == "") {
      return this.setState({
        races: this.state.searchRaces,
      });
    } else {
      const searchResults = this.state.searchRaces.filter(
        (races) => races.raceName.toLowerCase().includes(item.target.value.toLowerCase()) ||
          races.Circuit.circuitName.toLowerCase().includes(item.target.value.toLowerCase()) ||
          races.Results[0].Driver.familyName.toLowerCase().includes(item.target.value.toLowerCase())
      );
      this.setState({
        races: searchResults,
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
        title: "Races",
        url: "/races"
      }
    ];

    return (
      <>
        <div className="top-level-background">
          <Breadcrumb breadcrumb={breadcrumb} />
          <Search filterValue={this.state.filterValue} handleSearch={this.handleSearch} />
          <div className="background">
            <h1 className="title">Race calendar</h1>
            <table className="table-race">
              <thead>
                <tr>
                  <th colSpan="5" className="title-small" >Race callendar - {this.state.selectedYear}</th>
                </tr>
                <tr className="race-th">
                  <th>Round</th>
                  <th>Grand Prix</th>
                  <th>Circuit</th>
                  <th>Date</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody >
                {this.state.races.map((race, i) => {
                  return (
                    <tr key={i} onClick={() => this.handleRaces(race.round)}>
                      <td>{race.round}</td>
                      <td>
                        <div className="flag-container">
                          <div className="flag">
                            {this.state.flags.map((flag, index) => {
                              if (race.Circuit.Location.country === flag.en_short_name) {
                                return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                              } else if (race.Circuit.Location.country === "UK" && flag.en_short_name === "United Kingdom of Great Britain and Northern Ireland") {
                                return (<Flag className="flag-size" key={index} country="GB" />);
                              } else if (race.Circuit.Location.country === "UAE" && flag.en_short_name === "United Arab Emirates") {
                                return (<Flag className="flag-size" key={index} country="AE" />);
                              } else if (race.Circuit.Location.country === "Korea" && flag.en_short_name === "Korea (Democratic People's Republic of)") {
                                return (<Flag className="flag-size" key={index} country="KR" />);
                              } else if (race.Circuit.Location.country === "USA" && flag.en_short_name === "United States of America") {
                                return (<Flag className="flag-size" key={i} country="US" />);
                              }
                            })}
                          </div>
                          <div className="flag-text">
                            {race.raceName}
                          </div>
                        </div>
                      </td>
                      <td>{race.Circuit.circuitName}</td>
                      <td>{race.date}</td>
                      <td>
                        <div className="flag-container">
                          <div className="flag">
                            {this.state.flags.map((flag, index) => {
                              if (race.Results[0].Driver.nationality === flag.nationality) {
                                return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                              } else if (race.Results[0].Driver.nationality === "British" && flag.nationality === "British, UK") {
                                return (<Flag className="flag-size" key={index} country="GB" />);
                              }
                            })}
                          </div>
                          <div className="flag-text">
                            {race.Results[0].Driver.familyName}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};