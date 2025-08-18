import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightText: "Welcome to PhotoShare App",
      version: null,
    };
    this._isMounted = false; // 标志位
  }

  componentWillUnmount() {
    this._isMounted = false; // 卸载前标记，防止 setState
  }

  generateNewRightText() {
    let user = null;
    const { pathname } = this.props.location;
    const hashPath = window.location.hash; // "#/users/57231f1a30e4351f4e9f4bd9"
    if (pathname.startsWith("/users/") && !pathname.includes("/photos")) {
      const userIdMatch = hashPath.match(/\/users\/([^/]+)/);
      const userId = userIdMatch ? userIdMatch[1] : null;

      axios("/user/" + userId).then((data) => {
        user = data.data;
        if (user && this._isMounted) {
          this.setState({ rightText: `${user.first_name} ${user.last_name}` });
        }
      });
    } else if (pathname.includes("/photos")) {
      const userIdMatch = hashPath.match(/\/photos\/([^/]+)/);
      const userId = userIdMatch ? userIdMatch[1] : null;
      axios("/user/" + userId).then((data) => {
        user = data.data;
        if (user && this._isMounted) {
          this.setState({
            rightText: `Photos of ${user.first_name} ${user.last_name}`,
          });
        }
      });
    } else {
      this.setState({
        rightText: "Welcome to PhotoShare App",
      });
    }
  }

  getVersion() {
    axios("/test/info").then((data) => {
      let info = data.data;
      if (info && this._isMounted) this.setState({ version: info.__v });
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.generateNewRightText();
    this.getVersion();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) this.generateNewRightText();
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Box className="topbar-left">
            <Typography variant="h6">huangyachao</Typography>
          </Box>
          <Box className="topbar-middle">
            <Typography variant="h6">version:{this.state.version}</Typography>
          </Box>
          <Box className="topbar-right">
            <Typography variant="subtitle1">{this.state.rightText}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
