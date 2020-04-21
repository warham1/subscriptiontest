import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useQuery, useSubscription, useMutation } from "react-apollo-hooks";

import "./Room.css";

const GET_USER = gql`
    query getUser($room: String) {
        getUser(room: $room)
    }
`;

const SEND_EVENT_MUTATION = gql`
    mutation sendEvent($name: String!, $room: String!, $dest: [String], $type: String!, $chatText: String) {
        sendEvent(name: $name, room: $room, dest: $dest, type: $type, chatText: $chatText)
    }
`;

const NEW_EVENT_SUBSCRIPTION = gql`
    subscription newEvent($room: String!, $name: String!) {
        newEvent(room: $room, name: $name) {
            type
            user {
                name
                room
            }
            chatText
        }
    }
`;

export default function Room(location) {
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState("");
    const [users, setUsers] = useState("");

    const myname = location.location.state.name;
    const thisroom = location.location.state.room;

    const { loading, data, error } = useQuery(GET_USER, {
        variables: { room: thisroom },
    });

    const [sendEvent] = useMutation(SEND_EVENT_MUTATION);

    const { data: eventData } = useSubscription(NEW_EVENT_SUBSCRIPTION, {
        variables: { room: thisroom, name: myname },
    });

    useEffect(() => {
        if (eventData !== undefined) {
            const EVENT = eventData.newEvent;
            if (EVENT.type === "TYPE_CHAT") {
                setChat([...chat, { user: EVENT.user.name, text: EVENT.chatText }]);
            } else if (EVENT.type === "TYPE_NEW_USER" && users !== "") {
                setUsers([...users, EVENT.user.name]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;

    const userlist = data.getUser;

    if (users === "") {
        setUsers(userlist);
    }
    const chatdiv = chat.map((message) => {
        if (message.user === myname) {
            return (
                <div style={{ color: "red" }}>
                    {message.user} : {message.text}
                </div>
            );
        }
        return (
            <div>
                {message.user} : {message.text}
            </div>
        );
    });

    let userdiv = "";
    if (users) {
        userdiv = users.map((user) => {
            if (user === myname) return <div style={{ color: "red" }}>{user}</div>;
            return <div>{user}</div>;
        });
    }

    const setMessage = (str) => {
        setInput(str);
    };

    const setChats = (e) => {
        e.preventDefault();
        console.log("sending message");

        if (input) {
            const re = /^-(\d{1,2})\s(.+)/;
            const myArray = re.exec(input);

            let dest;
            let chatText = input;

            if (myArray !== null) {
                [, dest, chatText] = myArray;
            }

            sendEvent({
                variables: {
                    name: myname,
                    room: thisroom,
                    type: "TYPE_CHAT",
                    dest,
                    chatText,
                },
            });
            setInput("");
        }
    };

    return (
        <div className="room">
            <div className="userlist-container">{userdiv}</div>
            <div className="game">게임판</div>
            <div className="chat-container">
                <div className="message-box">{chatdiv}</div>
                <div>
                    <input
                        value={input}
                        onChange={({ target: { value } }) => {
                            setMessage(value);
                        }}
                        onKeyPress={(e) => (e.key === "Enter" ? setChats(e) : null)}
                        type="text"
                        placeholder="Type a message..."
                    />
                </div>
            </div>
        </div>
    );
}

Room.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            name: PropTypes.string.isRequired,
            room: PropTypes.string.isRequired,
        }),
    }).isRequired,
};
