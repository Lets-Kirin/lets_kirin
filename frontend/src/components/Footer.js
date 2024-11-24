import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import github from "../images/github-solid.svg";
import logo from "../images/runningkirin.png";
import { FlexBox } from "../styles/styled";
function Footer() {
    const navigate = useNavigate();
    return (
        <FooterBox>
            <LogoSection>
                <img src={logo} alt="로고" />
            </LogoSection>
            <FirstSection>
                <h1>2024년 학술제</h1>
                <h2>Let's Kirin</h2>
            </FirstSection>
            <SecondSection>
                <h1>본 웹사이트는 세종대학교 2024년 학술제 참가를 위해 만들어졌습니다.</h1>
            </SecondSection>
            <ThirdSection>
                <img src={github} alt="깃허브" onClick={() => { window.location.href = "https://github.com/Jinu-uu/lets_kirin"; }} />
            </ThirdSection>
        </FooterBox>
    )
}

export default Footer;

const FooterBox = styled(FlexBox)`
    width: 100%;
    height: 11%;
    background-color: #404040;
`
const LogoSection = styled(FlexBox)`
    width: 15%;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
    img{
        width: 2.4rem;
        height: auto;
    }
`
const FirstSection = styled(FlexBox)`    
    padding-left: 1%;
    width: 20%;
    height: 100%;
    justify-content: center;
    flex-direction: column;
    color: #FFF;
    font-weight: 700;
    h1{
        font-size: 0.56rem;
    }
    h2{
        font-size: 0.5rem;
    }
`
const SecondSection = styled(FlexBox)`
    width: 30%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    h1{
        color: #FFF;
        font-size: 0.5rem;
        font-weight: 400;
    }
    
`
const ThirdSection = styled(FlexBox)`
    width: 30%;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
    gap:2%;
    margin-right: 5%;
    img{
        cursor: pointer;
        width: 1.5rem;
        height: auto;
    }
`