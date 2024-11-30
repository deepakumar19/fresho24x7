import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../redux/authSlice';

export function PrivateRoute({ element }) {
  const user = useSelector(selectUser);
  console.log(user)

  if (!user) {
    return <Navigate to="/sign-in" />;  // Redirect to SignIn if not authenticated
  }

  return element;  // If user is authenticated, render the route's element
}
