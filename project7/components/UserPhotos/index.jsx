import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";
/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */

function CommentCard({ comment }) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between">
            <Button
              component={Link}
              to={`/users/${comment.user._id}`}
              className="comment-user-button"
            >
              {comment.user.first_name + " " + comment.user.last_name}
            </Button>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>
              {new Date(comment.date_time).toLocaleString()}
            </span>
          </Box>
        }
        secondary={comment.comment}
      />
    </ListItem>
  );
}

function PhotoCard({ photo }) {
  const comments = photo.comments || [];
  return (
    <Card style={{ marginBottom: "24px", maxWidth: "600px", margin: "auto" }}>
      <CardMedia
        component="img"
        height="300"
        image={"../../images/" + photo.file_name}
        alt="Photo"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Created at: {new Date(photo.date_time).toLocaleString()}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Comments:
        </Typography>
        <List>
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [], // 初始没有数据
    };
    this._isMounted = false;
  }
  componentWillUnmount() {
    this._isMounted = false; // 卸载前标记，防止 setState
  }

  GetNewPotos() {
    const userId = this.props.match.params.userId;
    axios("/photosOfUser/" + userId).then((data) => {
      if (this._isMounted) {
        this.setState({ photos: data.data });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.GetNewPotos();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevState.photos) !== JSON.stringify(this.state.photos)
    ) {
      this.GetNewPotos();
    }
  }

  render() {
    const photos = this.state.photos;
    return (
      <div>
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    );
  }
}

export default UserPhotos;
