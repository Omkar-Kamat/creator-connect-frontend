import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const style = {
  wrapper: "min-h-screen bg-black",
  container: "max-w-6xl mx-auto px-4 py-8 text-white"
};

const Layout = () => {

  return (

    <div className={style.wrapper}>

      <Navbar />

      <main className={style.container}>
        <Outlet />
      </main>

    </div>

  );

};

export default Layout;