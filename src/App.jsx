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
import ChatPage from "./components/Chat/ChatPage";
import useChatsGlobal from "./utils/customHooks/useChatsGlobal";
import AuthCallback from "./components/Auth/AuthCallback";
import PrivacyPolicy from "./components/Footer/Legal/PrivacyPolicy";
import TermsOfService from "./components/Footer/Legal/TermsOfService";
import { AboutUs } from "./components/Footer/CompanyPages/About";
import { DeveloperForum } from "./components/Footer/Community/DeveloperForum";
import { Events } from "./components/Footer/Community/Events"
import { Partnerships } from "./components/Footer/Community/Partnerships";
import { SuccessStories } from "./components/Footer/Community/SuccessStories";
import { Blog } from "./components/Footer/CompanyPages/Blog";
import { Careers } from "./components/Footer/CompanyPages/Careers";
import { Press } from "./components/Footer/CompanyPages/Press";
import { CookiePolicy } from "./components/Footer/Legal/CookiePolicy";
import { CommunityGuidelines } from "./components/Footer/Legal/CommunityGuidelines";
import { HelpCenter } from "./components/Footer/Support/HelpCenter";
import { SafetyTips } from "./components/Footer/Support/SafetyTips";
import { ContactUs } from "./components/Footer/Support/ContactUs";
import { FAQs } from "./components/Footer/Support/Faq";
import { CancellationRefund } from "./components/Footer/CompanyPages/RefundPolicy";
import { ShippingDelivery } from "./components/Footer/CompanyPages/ShippingDelivery";

const AppContent = () => {
	const user = useSelector((store) => store.user);
	const isAuthenticated = !!user?._id;
	useHeartbeat(isAuthenticated);
	useOfflineStatus(isAuthenticated);
	useSocketStatus(isAuthenticated);
	useChatsGlobal();

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
					<Route path='/chats' element={<ChatPage />} />
				</Route>
				<Route path='/auth/callback' element={<AuthCallback />} />
				<Route path='/about' element={<AboutUs />} />
				<Route path='/careers' element={<Careers />} />
				<Route path='/press' element={<Press />} />
				<Route path='/blog' element={<Blog />} />
				<Route path='/refund-policy' element={<CancellationRefund />} />
				<Route path='/shipping-delivery' element={<ShippingDelivery />} />
				<Route path='/help-center' element={<HelpCenter />} />
				<Route path='/safety-tips' element={<SafetyTips />} />
				<Route path='/contact' element={<ContactUs />} />
				<Route path='/faq' element={<FAQs />} />
				<Route path='/privacy-policy' element={<PrivacyPolicy />} />
				<Route path='/terms-service' element={<TermsOfService />} />
				<Route path='/cookies-policy' element={<CookiePolicy />} />
				<Route path='/community-guidelines' element={<CommunityGuidelines />} />
				<Route path='/success-stories' element={<SuccessStories />} />
				<Route path='/events' element={<Events />} />
				<Route path='/developer-forum' element={<DeveloperForum />} />
				<Route path='/partnerships' element={<Partnerships />} />
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