import React, { Component, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Forgotpassword = React.lazy(() =>
  import("./views/pages/login/forgot_password"),
);
const Verifyotp = React.lazy(() => import("./views/pages/login/verify_otp"));
const Createnewpassword = React.lazy(() =>
  import("./views/pages/login/create_new_password"),
);

const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/verifyotp"
              name="Verify otp"
              element={<Verifyotp />}
            />
            <Route
              exact
              path="/createnewpassword"
              name="Create New Password"
              element={<Createnewpassword />}
            />

            <Route
              exact
              path="/forgotpassword"
              name="Forgot Password"
              element={<Forgotpassword />}
            />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="/*" name="Home" element={<DefaultLayout />} />
            {/* <Route path="/*" name="Page 404" element={<Page404 />} /> */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
