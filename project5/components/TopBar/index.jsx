import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { withRouter } from "react-router-dom";
import "./styles.css";

class TopBar extends React.Component {
  render() {
    const { pathname } = this.props.location;
    const hashPath = window.location.hash; // "#/users/57231f1a30e4351f4e9f4bd9"

    let rightText = "";
    if (pathname.startsWith("/users/") && !pathname.includes("/photos")) {
      const userIdMatch = hashPath.match(/\/users\/([^/]+)/);
      const userId = userIdMatch ? userIdMatch[1] : null;
      const user = window.cs142models.userModel(userId);
      if (user) rightText = `${user.first_name} ${user.last_name}`;
    } else if (pathname.includes("/photos")) {
      const userIdMatch = hashPath.match(/\/photos\/([^/]+)/);
      const userId = userIdMatch ? userIdMatch[1] : null;
      const user = window.cs142models.userModel(userId);
      if (user) rightText = `Photos of ${user.first_name} ${user.last_name}`;
    } else {
      rightText = "Welcome to PhotoShare App";
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Box className="topbar-left">
            <Typography variant="h6">huangyachao</Typography>
          </Box>
          <Box className="topbar-right">
            <Typography variant="subtitle1">{rightText}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
