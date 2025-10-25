import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Auth/Login";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import SignUp from "./components/Auth/SignUp";
import UserProfile from "./components/Profile/UserProfile";
import EditProfile from "./components/Profile/EditProfile";
import Requests from "./components/Requests/Requests";
import Feed from "./components/Feed/Feed";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Chat from "./components/Chat/Chat";
import useHeartbeat from "./utils/customHooks/useHeartbeat";
import useOfflineStatus from "./utils/customHooks/useOfflineStatus";
import useSocketStatus from "./utils/customHooks/useSocketStatus";

const AppContent = () => {
	const user = useSelector((store) => store.user);
	const isAuthenticated = !!user?._id;
	useHeartbeat(isAuthenticated);
	useOfflineStatus(isAuthenticated);
	useSocketStatus(isAuthenticated);

	return (
		<BrowserRouter basename='/'>
			<Routes>
				<Route path='/' element={<Body />}>
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/profile/' element={<UserProfile />} />
					<Route path='/profile/edit' element={<EditProfile />} />
					<Route path='/requests' element={<Requests />} />
					<Route path='/' element={<Feed />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/chat/:userId' element={<Chat />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

function App() {
	return (
		<Provider store={appStore}>
			<AppContent />
		</Provider>
	);
}

export default App;