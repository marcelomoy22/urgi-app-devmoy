import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from 'react-native-safe-area-context'

import App from "./App";
import Spinner from "./components/loaders/Spinner";
import configureStore from "./configureStore";

export const storeObj = {};

class Root extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      persist: configureStore(() => this.setState({ isLoading: false })),
    };
    storeObj.store = this.state.persist.store;
  }

  render() {
    const content = (
      <Provider store={this.state.persist.store}>
        <PersistGate
          loading={<ActivityIndicator size="large" />}
          persistor={this.state.persist.persistor}
        >
          <App />
        </PersistGate>
      </Provider>
    );

    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>{content}</View>
      </SafeAreaProvider>
    );
  }
}
export default Root;
