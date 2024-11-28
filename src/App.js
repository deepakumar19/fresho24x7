import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Categories from './components/Categories';
import Signin from './components/auth/Signin';
import SignUp from './components/auth/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import CategoryDetail from './components/CategoryDetail';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Checkout from './components/Checkout';
import SignOut from './components/auth/SignOut';
import { useLocalStorage } from './components/useLocalStorage';

function App() {

  const router = createBrowserRouter([{
    path: "/", element: <Navbar />, children: [{
      index: true, element: <Home />
    }, {
      path: 'sign-in', element: <Signin />
    },
    {
      path: 'sign-up', element: <SignUp />
    },
    {
      path: 'category/:id', element: <CategoryDetail/>, children:[{ 
        path: 'product/:productId', element: <ProductDetail />
      }]
    },
    {
      path: 'cart', element: <Cart />
    },
    {
      path: 'orders', element: <Orders />
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
  ]
  }])
  // const { setValue, remove } = useLocalStorage("user", "deepa");
  // setValue();
  // remove();
  return (
    <div className="container bg-light">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
