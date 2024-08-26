import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { Nav } from "./components/header";
import { Foot } from "./components/footer";
import ContactForm from "./pages/contact";
import Voting from "./pages/voting";
import Home from "./pages/Home";
import LoginOTP from "./pages/LoginOTP";
import VerifyOTP from "./pages/VerifyOTP";
import CheckEmail from "./pages/CheckEmail";
import SetNewPassword from "./pages/SetNewPassword";
import VoterListSelection from "./pages/TypesOfElection";
import LoginWithPass from "./pages/LoginWithPass";
import ChatWidget from "./pages/ChatWidget";
import BillAds from "./pages/BillAds";

import Chat from "./components/Chat";

import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset";
import BillboardDesignPage from "./pages/BillboardDesignPage";
import Advertisement from "./pages/advertisements";
import ElectionResults from "./pages/result";
import AdvertisementView from "./components/home/AdvertisementView";
import PublicRoute from "./components/PublicRoute";
import NewsComponent from "./pages/news";
import { useAuth } from "./context/AuthContext";
import ElectionResults5 from "./pages/ElectionResults";
import NominationForm from "./pages/NominationForm";
import About from "./pages/About";
import PartyListNominationForm from "./pages/PartyListNominationForm";
import News from "./pages/news";
import ViewerPage from "./components/LiveStreem/ViewerPage";
import VideoModal from "./pages/VideoModal";
import LiveStream from "./components/LiveStreem/LiveStream";
import Room from "./components/LiveStreem/Room";
import Image from "./pages/Image";

function App() {
  const { login } = useAuth();
  const options = {
    "client-id":
      "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ",
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      login(token);
    }
  }, [login]);

  return (
    <PayPalScriptProvider options={options}>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/Chat" element={<Chat />} />
            //////////////////////////
            <Route path="/LiveStream" element={<LiveStream />} />
            <Route path="LiveStream/room/:roomId" element={<Room />} />
            <Route path="LiveStream/viewer/:roomId" element={<ViewerPage />} />
            //////////////////////
            <Route path="/nomination" element={<NominationForm />} />
            <Route
              path="/PartyListNominationForm"
              element={<PartyListNominationForm />}
            />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/voting/:listtype" element={<Voting />} />
            <Route path="/votinglist" element={<VoterListSelection />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/advertisementsView/:id"
              element={<AdvertisementView />}
            />
            <Route path="/BillAds" element={<BillAds />} />
            {/* Public Routes for non-authenticated users */}
            <Route
              path="/login-otp"
              element={<PublicRoute element={<LoginOTP />} />}
            />
            <Route
              path="/login-with-password"
              element={<PublicRoute element={<LoginWithPass />} />}
            />
            <Route
              path="/verify-otp"
              element={<PublicRoute element={<VerifyOTP />} />}
            />
            <Route
              path="/check-email"
              element={<PublicRoute element={<CheckEmail />} />}
            />
            <Route path="/set-new-password" element={<SetNewPassword />} />
            <Route
              path="/request-password-reset"
              element={<PublicRoute element={<PasswordResetRequest />} />}
            />
            <Route
              path="/reset-password"
              element={<PublicRoute element={<PasswordReset />} />}
            />
            {/* Uncomment and use if needed */}
            <Route path="/billboard" element={<BillboardDesignPage />} />
            <Route path="/result" element={<ElectionResults />} />
            <Route path="/Advertisement" element={<Advertisement />} />
            <Route path="/Electionresult" element={<ElectionResults5 />} />
            <Route path="/About" element={<About />} />
            <Route path="/news" element={<News />} />
          </Routes>
          <VideoModal />
          <ChatWidget />
          <Foot />
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
