import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccout from "./routes/createAccount"
import styled, { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/loadingScreen"
import { auth } from "./firebase"


const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children:[
      {
        path:"",
        element: <Home />
      },
      {
        path:"profile",
        element: <Profile />
      }
    ]
  },
  {
    path:"/login",
    element: <Login />
  },
  {
    path:"/create-account",
    element: <CreateAccout />
  }
])


const GlobalStyles = createGlobalStyle`
  ${reset}; // 모든 스타일을 리셋해주는 설정
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    //font-family
  }

`;


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    // firebase 인증 처리 !
    await auth.authStateReady();
    // 로딩 화면
    setIsLoading(false);
  }

  useEffect(()=> {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen/> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App


const Wrapper = styled.div`
  height:100vh;
  display: flex;
  justify-content: center;
`;