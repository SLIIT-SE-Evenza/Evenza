import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToastContainer from "@/components/shared/ToastContainer";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * App — Root component
 * Sets up React Context providers, React Router DOM, shared layout (Navbar + Footer),
 * and top-level route configuration per the Evenza architecture spec.
 */
function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<NotificationProvider>
					{/* Global layout shell */}
					<div className="min-h-screen flex flex-col bg-background text-foreground">
						{/* Sticky navbar */}
						<Navbar />

						{/* Page content */}
						<div className="flex-1">
							<Routes>
								{/* Public routes */}
								<Route path="/" element={<HomePage />} />

								{/* 404 fallback */}
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</div>
					</div>

					{/* Global toast overlay */}
					<ToastContainer />
				</NotificationProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
