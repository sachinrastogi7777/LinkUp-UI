import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import Login from "./components/Auth/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import SignUp from "./components/Auth/SignUp";
import UserProfile from "./components/Profile/UserProfile";
import EditProfile from "./components/Profile/EditProfile";

function App() {
	return (
		<Provider store={appStore}>
			<BrowserRouter basename='/'>
				<Routes>
					<Route path='/' element={<Body />} >
						<Route path='/login' element={<Login />} />
						<Route path='/signup' element={<SignUp />} />
						<Route path='/profile/' element={<UserProfile />} />
						<Route path='/profile/edit' element={<EditProfile />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	)
}

export default App;