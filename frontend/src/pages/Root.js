import { Outlet } from "react-router-dom";
import { WidthBlock, Wrapper } from "../styles/styled";
import Footer from "../components/Footer";
import Header from "../components/Header";
function Root() {
    return (
        <Wrapper>
            <WidthBlock>
                <Header />
                <Outlet />
                <Footer />
            </WidthBlock>
        </Wrapper>
    )
}

export default Root;