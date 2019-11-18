import React from "react";
import { Layout } from "antd";
import { BrowserRouter } from "react-router-dom";
import Head from "./layout/Head";
import Side from "./layout/Side";
import Router, { routerConfig } from "./Router";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Head />
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
          <Side routerConfig={routerConfig} />
          <Layout style={{ padding: "0 24px 24px" }}>
            <Router />
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}
export default App;
