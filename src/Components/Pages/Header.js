import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { UserContext } from "../Pages/UserContext";
import { useSelector } from "react-redux";

const Header = () => {
    const firstName = useSelector((state) => state.firstName);
    const { lastName } = useContext(UserContext);

    return (
        <div className="header-container">
            <Typography className="header-text">
                Welcome, {firstName} {lastName}!
            </Typography>
        </div>
    );
};

export default Header;
