"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";

export const StoreProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const persistor = persistStore(store);

  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}>{() => children}</PersistGate> */}
      {children}
    </Provider>
  );
};
