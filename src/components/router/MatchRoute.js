import React from "react";
import { Redirect, Route, useLocation } from "react-router";

const MatchRoute = ({ component: Component, ...rest }) => {
    const location = useLocation();

    return (
        <Route
            {...rest}
            component={(props) =>
                !!location.state?.player1?.userId && !!location.state?.player2?.userId ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/home" />
                )
            }
        />
    );
};

export default MatchRoute;
