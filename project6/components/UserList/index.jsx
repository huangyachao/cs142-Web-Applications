import React from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import fetchModel from "../../lib/fetchModelData.js";
import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [], // 初始没有数据
    };
  }

  componentDidMount() {
    axios("/user/list").then((data) => {
      this.setState({ userList: data.data });
    });
  }

  render() {
    const userList = this.state.userList;
    return (
      <div>
        <List component="nav">
          {userList.map((user) => {
            return (
              <React.Fragment key={user._id}>
                <ListItemButton component={Link} to={`/users/${user._id}`}>
                  <ListItemText
                    primary={user.first_name + " " + user.last_name}
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </div>
    );
  }
}

export default UserList;
