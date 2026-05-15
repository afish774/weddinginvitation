import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GeneralInvite from "./pages/GeneralInvite";
import SpecificInvite from "./pages/SpecificInvite";
import RsvpConfirmation from "./pages/RsvpConfirmation.jsx";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General invitation (public) */}
        <Route path="/invite" element={<GeneralInvite />} />

        {/* Personalized invitation */}
        <Route path="/invite/:guestId" element={<SpecificInvite />} />

        {/* RSVP confirmation & celebration page */}
        <Route path="/rsvp/confirm/:guestId" element={<RsvpConfirmation />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/invite" replace />} />
        <Route path="*" element={<Navigate to="/invite" replace />} />
      </Routes>
    </BrowserRouter>
  );
}