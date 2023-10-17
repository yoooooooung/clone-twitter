import { Outlet } from "react-router-dom";
import { auth } from "../firebase";

export default function Layout() {
  // 로그아웃 로직은 이걸로 끝 !
  const logOut = () => {
    auth.signOut();
  };

  return (
    <>
      <h1>Layout</h1>
      <div>
        <button onClick={logOut}>Log Out</button>
      </div>
      {/* <Outlet /> */}
    </>
  );
}
