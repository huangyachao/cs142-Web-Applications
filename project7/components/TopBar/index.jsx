import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftText: "Please Login",
      rightText: "Welcome to PhotoShare App",
      version: null,
    };
    this._isMounted = false; // 标志位
    this.handleLogout = this.handleLogout.bind(this);
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

  async handleLogout() {
    try {
      const response = await axios.post("/admin/logout");

      if (response.data.success) {
        // 如果有全局登录状态，需要在这里设置 hasLoginIn = false
        this.props.onChangeLoginState(false, "");
      } else {
        console.error("登出失败: " + response.data.message);
      }
    } catch (error) {
      console.error("登出请求异常:", error);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.generateNewRightText();
    this.getVersion();
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasLoginIn) {
      if (prevProps.firstName !== this.props.firstName) {
        this.setState({ leftText: `Hi, ${this.props.firstName}` });
      }
      if (prevProps.location !== this.props.location) {
        this.generateNewRightText();
      }
    }
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Box className="topbar-left">
            <Typography variant="h6">{this.state.leftText}</Typography>
            {this.props.hasLoginIn && (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleLogout}
              >
                LogOut
              </Button>
            )}
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
