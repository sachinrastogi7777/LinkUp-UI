import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import Login from "./components/Auth/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

function App() {
	return (
		<Provider store={appStore}>
			<BrowserRouter basename='/'>
				<Routes>
					<Route path='/' element={<Body />} >
						<Route path='/login' element={<Login />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	)
}

export default App;