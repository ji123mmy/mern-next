import { useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { Container } from "semantic-ui-react";
import { Provider } from "react-redux";
import jwtDecode from "jwt-decode";
import client from "../apollo-client";
import { User } from "./login/types";
import "../semantic.css";
import MenuBar from "../components/MenuBar";
import { store } from "../redux/store";
import { setUserInfo } from "../redux/authSlice";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    interface DecodeToken extends User {
      exp: number;
    }
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    const decodeToken = jwtDecode<DecodeToken>(token);
    if (decodeToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwtToken");
      store.dispatch(setUserInfo(null));
    } else {
      store.dispatch(setUserInfo(decodeToken));
    }
  }, []);
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Container>
          <MenuBar />
          <Component {...pageProps} />
        </Container>
      </Provider>
    </ApolloProvider>
  );
}


export default MyApp;
