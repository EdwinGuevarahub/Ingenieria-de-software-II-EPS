import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ padding: 0, margin: 0 }}>
        {children}
    </main>
  </>
);

export default MainLayout;
