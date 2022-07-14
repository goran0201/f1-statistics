import React from "react";
import history from "./../history";
import Loader from "./Loader";
import Flag from 'react-flagkit';
import Breadcrumb from "./Breadcrumb";
import Search from "./Search";

export default class Teams extends React.Component {

  state = {
    allTeams: [],
    selectedYear: "",
    isLoading: true,
    flags: [],
    searchTeams: [],
    filterValue: ""
  };

  componentDidMount() {
    this.getTeams();
  };

  componentDidUpdate() {
    this.getTeams();
  }

  getTeams = async () => {
    const year = localStorage.getItem("chosen");
    if (year === this.state.selectedYear) {
      return;
    }
    const url = `http://ergast.com/api/f1/${year}/constructorStandings.json`;
    const urlFlags = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";
    const data = await fetch(url);
    const dataFlags = await fetch(urlFlags);
    const teams = await data.json();
    const flags = await dataFlags.json();
    const allTeams = teams.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    this.setState({
      allTeams: allTeams,
      selectedYear: year,
      isLoading: false,
      flags: flags,
      searchTeams: teams.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
    });
  };

  handleTeams = (constructorId) => {
    const linkTo = "/teams/details/" + constructorId;
    history.push(linkTo);
  };

  handleSearch = (items) => {
    if (items.target.value == "") {
      return this.setState({
        allTeams: this.state.searchTeams,
      });
    } else {
      const searchResult = this.state.searchTeams.filter(
        (teams) =>
          teams.Constructor.constructorId.toLowerCase().includes(items.target.value.toLowerCase())
      );
      this.setState({
        allTeams: searchResult,
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
        title: "Teams",
        url: "/teams"
      }
    ];

    return (
      <>
        <div className="top-level-background">
          <Breadcrumb breadcrumb={breadcrumb} className="breadcrumb" />
          <Search searchValues={this.state.searchValues} handleSearch={this.handleSearch} />
          <div className="background">
            <h1 className="title">Constructors Campionship</h1>
            <table className="table">
              <thead>
                <tr>
                  <th colSpan="4" className="title-small">Constructors Championship Standings - {this.state.selectedYear}</th>
                </tr>
              </thead>
              {this.state.allTeams.map((team, i) => {
                return (
                  <tbody key={i} onClick={() => this.handleTeams(team.Constructor.constructorId)}>
                    <tr>
                      <td>{team.position}</td>
                      <td>
                        <div className="flag-container">
                          <div className="flag">
                            {this.state.flags.map((flag, index) => {
                              if (team.Constructor.nationality === flag.nationality) {
                                return (<Flag className="flag-size" key={index} country={flag.alpha_2_code} />);
                              } else if (team.Constructor.nationality === "British" && flag.nationality === "British, UK") {
                                return (<Flag className="flag-size" key={index} country="GB" />);
                              }
                            })}
                          </div>
                          <div className="flag-text">
                            {team.Constructor.name}
                          </div>
                        </div>
                      </td>
                      <td>Details <a href={team.Constructor.url} target="_blank"><img className="link-img" src={"/img/link-black.png"} width={16} height={16} /></a></td>
                      <td>{team.points}</td>
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
