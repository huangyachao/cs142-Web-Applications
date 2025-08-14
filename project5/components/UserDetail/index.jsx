import React from "react";
import { Card, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const userId = this.props.match.params.userId;
    const user = window.cs142models.userModel(userId);
    return (
      <Card className="user-card">
        {/* 用户名 */}
        <Typography className="user-name">
          {user.first_name} {user.last_name}
        </Typography>

        {/* 用户ID */}
        <Typography className="user-id">ID: {user._id}</Typography>

        {/* 位置和职业 */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className="user-grid-item">
            <Typography className="user-field">
              <strong>Location:</strong> {user.location}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="user-grid-item">
            <Typography className="user-field">
              <strong>Occupation:</strong> {user.occupation}
            </Typography>
          </Grid>
        </Grid>

        {/* 描述 */}
        <Typography className="user-description">
          <strong>Description:</strong> {user.description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/photos/${user._id}`}
          style={{ marginTop: "20px" }}
        >
          View Photos
        </Button>
      </Card>
    );
  }
}

export default UserDetail;
