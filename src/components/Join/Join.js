import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import "./Join.css";

const SEND_EVENT_MUTATION = gql`
    mutation sendEvent($name: String!, $room: String!, $dest: [String], $type: String!, $chatText: String) {
        sendEvent(name: $name, room: $room, dest: $dest, type: $type, chatText: $chatText)
    }
`;

export default function Join() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState(0);
    const [newUser] = useMutation(SEND_EVENT_MUTATION);
    const history = useHistory();

    const sendNewUser = async () => {
        const result = await newUser({
            variables: {
                name,
                room,
                type: "TYPE_NEW_USER",
            },
        });
        const isNewUser = result.data.sendEvent;

        if (isNewUser === "true") {
            history.push({
                pathname: "/room",
                state: {
                    name,
                    room,
                },
            });
        } else if (isNewUser === "false") {
            alert("이미 있는 닉네임입니다.");
        }
    };

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
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendNewUser();
                        }
                    }}
                />
                <input
                    placeholder="room"
                    type="text"
                    onChange={(e) => {
                        setRoom(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendNewUser();
                        }
                    }}
                />
                <button onClick={sendNewUser} type="submit">
                    Join
                </button>
            </div>
        </div>
    );
}
