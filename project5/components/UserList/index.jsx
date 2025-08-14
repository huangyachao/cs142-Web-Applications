import React from "react";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const userList = window.cs142models.userListModel();
    console.log(userList);
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
