import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/slices/authSlice";
import { PersistGate } from "redux-persist/integration/react";

function AppContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
