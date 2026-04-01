import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { StatusBar } from 'expo-status-bar';
import Dashboard from './src/screens/Dashboard';

export default function App() {
  return (
    // Uygulamayı Redux Provider ile sarmalayarak Single Source of Truth'u devreye sokuyoruz
    <Provider store={store}>
      <Dashboard />
      <StatusBar style="auto" />
    </Provider>
  );
}