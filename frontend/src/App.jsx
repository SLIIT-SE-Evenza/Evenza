import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToastContainer from "@/components/shared/ToastContainer";

// Auth & Public
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Authenticated Role Portals
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import StockCatalog from "./pages/inventory/StockCatalog";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import GuestDashboard from "./pages/guest/GuestDashboard";
import VendorPromotionsPage from "./pages/vendor/VendorPromotionsPage";
import CustomerPromotionsPage from "./pages/customer/CustomerPromotionsPage";

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
								{/* Public Marketing & Auth */}
								<Route path="/" element={<HomePage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />

								{/* Role-Based Authenticated Portals */}
								<Route
									path="/dashboard/inventory"
									element={<InventoryDashboard />}
								/>
								<Route
									path="/dashboard/inventory/catalog"
									element={<StockCatalog />}
								/>

								<Route
									path="/portal/customer"
									element={<CustomerDashboard />}
								/>
								<Route
									path="/portal/customer/promotions"
									element={<CustomerPromotionsPage />}
								/>

								<Route path="/portal/manager" element={<ManagerDashboard />} />

								<Route path="/portal/vendor" element={<VendorDashboard />} />
								<Route
									path="/portal/vendor/promotions"
									element={<VendorPromotionsPage />}
								/>

								<Route path="/portal/admin" element={<AdminDashboard />} />

								<Route path="/portal/guest" element={<GuestDashboard />} />

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
