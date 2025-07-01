import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/NotFound";
import UserProfiles from "./pages/UserProfile";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { PublicRoute, PrivateRoute } from "./components/RouteWrapper";
import { menuPermissions, PERMISSION_VALUES, ROUTES } from "./utils";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import Customers from "./pages/Customers/Customers";
import Transactions from "./pages/Transactions/Transactions";
import { useTheme } from "./context/ThemeContext";
import Settings from "./pages/Settings/Settings";
import Users from "./pages/Users/Users";
import PendingTransactions from "./pages/Transactions/PendingTransactions";
import NewTransaction from "./pages/Transactions/NewTransaction";
import Metrics from "./pages/Metrics";

const protected_routes = [
    {
        Path: ROUTES.DASHBOARD,
        element: <PrivateRoute children={<Home />} componentPermissions={menuPermissions("dashboard")} />,
        isIndex: true
    },
    {
        Path: ROUTES.CUSTOMERS,
        element: <PrivateRoute children={<Customers />} componentPermissions={menuPermissions("customers")} />,
        isIndex: false
    },
    {
        Path: ROUTES.ALL_TRANSACTIONS,
        element: <PrivateRoute children={<Transactions />} componentPermissions={[PERMISSION_VALUES.transaction.view_transactions]} />,
        isIndex: false
    },
    {
        Path: ROUTES.PENDING_TRANSACTIONS,
        element: (
            <PrivateRoute children={<PendingTransactions />} componentPermissions={[PERMISSION_VALUES.transaction.approve_transaction]} />
        ),
        isIndex: false
    },
    {
        Path: ROUTES.NEW_TRANSACTIONS,
        element: <PrivateRoute children={<NewTransaction />} componentPermissions={[PERMISSION_VALUES.transaction.initiate_transaction]} />,
        isIndex: false
    },
    {
        Path: ROUTES.SETTINGS,
        element: <PrivateRoute children={<Settings />} componentPermissions={menuPermissions("business")} />,
        isIndex: false
    },
    {
        Path: ROUTES.USERS,
        element: <PrivateRoute children={<Users />} componentPermissions={menuPermissions("users")} />,
        isIndex: false
    },
    {
        Path: ROUTES.PROFILE,
        element: <PrivateRoute children={<UserProfiles />} />,
        isIndex: false
    },
    {
        Path: ROUTES.METRICS,
        element: <PrivateRoute children={<Metrics />} componentPermissions={menuPermissions("metrics")} />,
        isIndex: false
    }
];

const public_routes = [
    { Path: ROUTES.SIGNIN, element: <PublicRoute children={<SignIn />} /> },
    { Path: ROUTES.FORGOT_PASSWORD, element: <PublicRoute children={<ForgotPassword />} /> },
    { Path: "*", element: <PublicRoute children={<NotFound />} /> }
];

const App = () => {
    const theme = useTheme();
    return (
        <>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route element={<AppLayout />}>
                        {protected_routes.map((route, i) => (
                            <Route key={i} index={route.isIndex} path={route.Path} element={route.element} />
                        ))}
                    </Route>
                    {public_routes.map((route, i) => (
                        <Route key={i} path={route.Path} element={route.element} />
                    ))}
                </Routes>
            </Router>
            <ToastContainer
                position="bottom-center"
                style={{ zIndex: 999999999 }}
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme.theme}
                transition={Bounce}
            />
        </>
    );
};

export default App;
