import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersList from "./../Components/Pages/UsersList";
import UserDetails from "./../Components/Pages/UserDetails";
import { Provider } from "react-redux";
import store from "./../Components/Pages/Store";
import { UserProvider } from "./../Components/Pages/UserContext";
import Header from "./../Components/Pages/Header";

const AppRouter = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<UsersList />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
        </Router>
      </UserProvider>
    </Provider>
  );
};

export default AppRouter;
