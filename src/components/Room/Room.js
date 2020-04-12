import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
// import { Query } from "react-apollo";
import { useQuery, useSubscription, useMutation } from "react-apollo-hooks";

import "./Room.css";

const GET_USER = gql`
    query getUser($room: String) {
        getUser(room: $room)
    }
`;

const NEW_USER_SUBSCRIPTION = gql`
    subscription newUser($room: String!) {
        newUser(room: $room) {
            name
            room
        }
    }
`;

const NEW_CHAT_SUBSCRIPTION = gql`
    subscription newMessage($room: String!) {
        newMessage(room: $room) {
            name
            room
            text
        }
    }
`;

const SEND_MESSAGE = gql`
    mutation sendMessage($room: String!, $name: String!, $text: String!) {
        sendMessage(room: $room, name: $name, text: $text)
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

    const [sendMessage] = useMutation(SEND_MESSAGE);

    const { loading: subLoading, data: newData } = useSubscription(NEW_USER_SUBSCRIPTION, {
        variables: { room: thisroom },
    });

    const { data: newnewData } = useSubscription(NEW_CHAT_SUBSCRIPTION, {
        variables: { room: thisroom },
    });

    useEffect(() => {
        if (users !== "" && newData !== undefined) {
            setUsers([...users, newData.newUser.name]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newData]);

    useEffect(() => {
        if (newnewData !== undefined) {
            setChat([
                ...chat,
                { user: newnewData.newMessage.name, text: newnewData.newMessage.text },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newnewData]);

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

        if (input) {
            sendMessage({
                variables: {
                    name: myname,
                    room: thisroom,
                    text: input,
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
