import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/authPage"
import PrivateRoute from "./layout/PrivateLayout"
import KanbanBoard from "./pages/KanbanBoardPage"

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/editor/:projectId"
                            element={<EditorPage />}
                        />
                        <Route path="/project/:projectId" element={<KanbanBoard />} />
                    </Route>
                </Routes>
            </Router>
            <Toast  /> {/* Toast component from react-hot-toast */}
        </>
    )
}

export default App
