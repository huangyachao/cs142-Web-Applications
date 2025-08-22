import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoginIn: false,
      firstName: "",
    };
    this.handleLoginStateChange = this.handleLoginStateChange.bind(this);
  }

  // 父组件传给子组件的回调函数
  handleLoginStateChange = (loginState, firstName) => {
    this.setState({ hasLoginIn: loginState, firstName: firstName });
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                firstName={this.state.firstName}
                hasLoginIn={this.state.hasLoginIn}
                onChangeLoginState={this.handleLoginStateChange}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                {this.state.hasLoginIn ? (
                  <UserList hasLoginIn={this.state.hasLoginIn} />
                ) : (
                  <p>请先登录查看用户列表</p>
                )}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => {
                      if (this.state.hasLoginIn) {
                        return (
                          <Typography variant="body1">
                            Welcome to your photosharing app! This{" "}
                            <a href="https://mui.com/components/paper/">
                              Paper
                            </a>{" "}
                            component displays the main content of the
                            application. The {"sm={9}"} prop in the{" "}
                            <a href="https://mui.com/components/grid/">Grid</a>{" "}
                            item component makes it responsively display 9/12 of
                            the window. The Switch component enables us to
                            conditionally render different components to this
                            part of the screen. You don&apos;t need to display
                            anything here on the homepage, so you should delete
                            this Route component once you get started.
                          </Typography>
                        );
                      } else {
                        return (
                          <LoginRegister
                            onChangeLoginState={this.handleLoginStateChange}
                          />
                        );
                      }
                    }}
                  />
                  <Route
                    path="/login-register"
                    render={() => (
                      <LoginRegister
                        onChangeLoginState={this.handleLoginStateChange}
                      />
                    )}
                  />
                  <Route
                    path="/users/:userId"
                    render={(props) => {
                      return this.state.hasLoginIn ? (
                        <UserDetail {...props} />
                      ) : (
                        <Redirect to="/login-register" />
                      );
                    }}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => {
                      return this.state.hasLoginIn ? (
                        <UserPhotos {...props} />
                      ) : (
                        <Redirect to="/login-register" />
                      );
                    }}
                  />
                  <Route
                    path="/users"
                    render={() => {
                      return this.state.hasLoginIn ? (
                        <UserList hasLoginIn={this.state.hasLoginIn} />
                      ) : (
                        <Redirect to="/login-register" />
                      );
                    }}
                  />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
