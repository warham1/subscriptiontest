import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
// import { Query } from "react-apollo";
import { useQuery } from "react-apollo-hooks";

import "./Room.css";

const GET_USER = gql`
    query {
        getUser {
            name
            room
        }
    }
`;

export default function Room() {
    const { loading, data, error } = useQuery(GET_USER);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;

    const users = data.getUser.map((user) => (
        <div>
            <div>{user.name}</div>
            <div>{user.room}</div>
        </div>
    ));

    return <div>{users}</div>;
}

Room.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            name: PropTypes.string.isRequired,
            room: PropTypes.string.isRequired,
        }),
    }).isRequired,
};
