import Header from "../components/headerParent";
import Footer from "../components/footer";
// DefaultLayout.jsx




const DefaultLayout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;