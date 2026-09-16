import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToastContainer from "@/components/shared/ToastContainer";

// Pages
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

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
						{/* Page content */}
						<div className="flex-1">
							<Routes>
								{/* Public routes */}
								<Route path="/" element={<HomePage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />

								{/* Fallback Portal Placeholders to prevent crashes on post-login redirect */}
								<Route
									path="/portal/customer"
									element={
										<div className="p-8 text-center">
											<h1 className="text-2xl font-bold">Customer Portal</h1>
										</div>
									}
								/>
								<Route
									path="/dashboard/inventory"
									element={
										<div className="p-8 text-center">
											<h1 className="text-2xl font-bold">
												Inventory Staff Portal
											</h1>
										</div>
									}
								/>
								<Route
									path="/portal/manager"
									element={
										<div className="p-8 text-center">
											<h1 className="text-2xl font-bold">
												Event Manager Portal
											</h1>
										</div>
									}
								/>
								<Route
									path="/portal/vendor"
									element={
										<div className="p-8 text-center">
											<h1 className="text-2xl font-bold">Vendor Portal</h1>
										</div>
									}
								/>
								<Route
									path="/portal/guest"
									element={
										<div className="p-8 text-center">
											<h1 className="text-2xl font-bold">Guest Portal</h1>
										</div>
									}
								/>

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
