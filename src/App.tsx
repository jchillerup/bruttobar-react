import { useAuth } from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

export default function App() {
  const { token, authLoading, login } = useAuth();

  if (authLoading) return <div className="p-4">Loading…</div>;

  console.log(token);
  if (!token || token === undefined) {
    return <LoginScreen login={login} />;
  }

  return <MainScreen token={token} />;
}
