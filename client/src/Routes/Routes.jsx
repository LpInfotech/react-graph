import {
  createBrowserRouter,

} from "react-router-dom";
import Layout from "../layout/Layout";
import Home from '../pages/Home/Home'


export  const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
        loader: async () => {return await fetch('/get/candidates').then(response=>response.json()).then(data=>data[0].response).catch(e=>console.log(e))}
      },
    ],
  },
]);


