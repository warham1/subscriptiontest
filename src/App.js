import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import client from "./apolloClient";
import Join from "./components/Join/Join";
import Room from "./components/Room/Room";

function App() {
    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <Router>
                    <Route path="/" exact component={Join} />
                    <Route path="/room" component={Room} />
                </Router>
            </ApolloHooksProvider>
        </ApolloProvider>
    );
}

export default App;
