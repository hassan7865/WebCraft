import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/authPage"
import PrivateRoute from "./layout/PrivateLayout"
import KanbanBoard from "./pages/KanbanBoardPage"
import Landing from "./pages/Landing"
import PublicLayout from "./layout/PublicLayout"

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route element={<PublicLayout />}>
                        <Route path="/auth" element={<AuthPage />} />
                    </Route>

                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<HomePage />} />
                        <Route
                            path="/editor/:projectId"
                            element={<EditorPage />}
                        />
                        <Route
                            path="/project/:projectId"
                            element={<KanbanBoard />}
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <Toast />
        </>
    )
}

export default App
