import PrivateRoute from "../components/PrivateRoute";
export default function Layout({ children }) {

  return (
        <PrivateRoute>
            {children}
        </PrivateRoute>
  );
}
