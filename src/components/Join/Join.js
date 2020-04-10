import React, { useState } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import "./Join.css";

const NEW_USER = gql`
    mutation newUser($name: String!, $room: String!) {
        newUser(name: $name, room: $room)
    }
`;

export default function Join() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState(0);
    const [newUser] = useMutation(NEW_USER);

    return (
        <div className="joinContainer">
            <p>Welcome</p>
            <div className="joinBox">
                <input
                    placeholder="name"
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <input
                    placeholder="room"
                    type="text"
                    onChange={(e) => {
                        setRoom(e.target.value);
                    }}
                />
                <Link
                    onClick={() => {
                        newUser({ variables: { name, room } });
                        console.log(1);
                    }}
                    to={{
                        pathname: "/room",
                        state: {
                            name,
                            room,
                        },
                    }}
                >
                    <button type="submit">Join</button>
                </Link>
            </div>
        </div>
    );
}
