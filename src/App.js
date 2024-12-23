import Navbar from './components/Navbar';
import Categories from './components/Categories';
import Signin from './components/auth/Signin';
import SignUp from './components/auth/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import CategoryDetail from './components/CategoryDetail';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Checkout from './components/Checkout';
import SignOut from './components/auth/SignOut';
import { PrivateRoute } from './components/PrivateRoute';
import { OrderConfirmation } from './components/OrderConfirmation';

function App() {
  
  const router = createBrowserRouter([{
    path: "/", element: <Navbar/>, children: [{
      index: true, element: <Categories />
    }, {
      path: 'sign-in', element: <Signin />
    },
    {
      path: 'sign-up', element: <SignUp />
    },
    {
      path: 'category/:id', element: <CategoryDetail/>
    },
    {
      path: 'cart', element: <PrivateRoute element={<Cart />}/>,
    },
    {
      path: 'orders', element: <PrivateRoute element={<Orders />}/>,
    },
    {
      path: 'checkout', element: <Checkout />
    },
    {
      path: '/', element: <Home />
    },
    {
      path: '/sign-out', element: <SignOut />
    },
    {
      path: '/order-confirmation', element: <OrderConfirmation />
    },
  ]
  }])

  return (
    <div className="container bg-light">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
