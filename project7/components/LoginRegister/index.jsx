import React, { useState } from "react";
import { Grid, Paper, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

export default function LoginRegister({ onChangeLoginState }) {
  //   const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({
    login_name: "",
    // password: "",
    // confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (mode === "register") {
    //   if (formData.password !== formData.confirmPassword) {
    //     alert("Passwords do not match!");
    //     return;
    //   }
    //   alert(`Registering user: ${formData.login_name}`);
    //   // 在这里调用注册接口
    // } else {
    try {
      const response = await axios.post("/admin/login", {
        login_name: formData.login_name,
        //   password: formData.password,
      });
      onChangeLoginState(true, response.data.first_name);
      setFormData({ login_name: "" });
      if (response.data._id) {
        window.location.href = `#/users/${response.data._id}`;
      } else {
        console.error("用户 ID 无效");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("用户名不存在");
      } else {
        console.error("登录失败:", error);
      }
    }
    // 在这里调用登录接口
    // }
    // 重置表单
    // setFormData({ login_name: "", password: "", confirmPassword: "" });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Paper style={{ padding: "2rem", marginTop: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            {/* {mode === "login" ? "Login" : "Register"} */}
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="LoginName"
              name="login_name"
              value={formData.login_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            {/* <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            /> */}
            {/* {mode === "register" && (
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            )} */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "1rem" }}
            >
              {/* {mode === "login" ? "Login" : "Register"} */}
              Login
            </Button>
          </form>
          {/* <Button
            color="secondary"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            {mode === "login" ? "Switch to Register" : "Switch to Login"}
          </Button> */}
        </Paper>
      </Grid>
    </Grid>
  );
}
