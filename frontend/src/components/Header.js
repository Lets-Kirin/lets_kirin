import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import kirinlogo from "../images/kirinlogo.png";
import { FlexBox } from "../styles/styled";
import { useEffect, useState } from "react";
function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeClass, setActiveClass] = useState('');

    useEffect(() => {
        const currentURL = location.pathname;
        if (currentURL.startsWith("/timetable")) {
            setActiveClass("timetable-active");
        } else if (currentURL.startsWith("/instruction")) {
            setActiveClass("instruction-active");
        } else if (currentURL.startsWith("/mypage")) {
            setActiveClass("mypage-active");
        } else {
            setActiveClass(''); // 기본 클래스 설정
        }
    }, [location]);
    const logOut = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <HeaderBox>
            <LeftBox>
                <h1 className={activeClass === 'timetable-active' ? "active" : ""} onClick={() => { navigate("/timetable") }}>시간표</h1>
                <h1 className={activeClass === 'instruction-active' ? "active" : ""} onClick={() => { navigate("/instruction") }}>사용법</h1>
            </LeftBox>
            <LogoBox>
                <img src={kirinlogo} alt="로고" />
                <h1>Let's Kirin</h1>
            </LogoBox>
            <RightBox>
                <h1 className={activeClass === 'mypage-active' ? "active" : ""} onClick={() => { navigate("/mypage") }}>마이페이지</h1>
                <h1 className="logout" onClick={logOut}>로그아웃</h1>
            </RightBox>
        </HeaderBox>
    )
}
export default Header;

const HeaderBox = styled(FlexBox)`
    width: 100%;
    height: 18%;
    padding-left: 6.25%;
    padding-right: 6.25%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-family: sans-serif;
    cursor: default;
`
const LeftBox = styled(FlexBox)`
    width: 15%;
    height: 35%;
    min-width: 8rem;
    min-height: 2rem;
    background-color: black;
    border-radius: 32px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    h1{
        cursor: pointer;
        width: 50%;
        color: rgba(255,255,255,0.8);
        font-size: 0.7rem;
        font-weight: 700;
        transition: font-size 0.5s ease, color 0.5s ease;
    }
    h1:hover{
        font-size: 0.8rem;
        text-decoration: underline;
        color: white;
    }
    .active{
        color: white;
        text-decoration: underline;
    }
`
const RightBox = styled(FlexBox)`
    width: 15%;
    height: 35%;
    min-width: 8rem;
    min-height: 2rem;
    background-color: black;
    border-radius: 32px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    h1{
        position: relative;
        cursor: pointer;
        width: 50%;
        font-size: 0.6rem;
        font-weight: 700;
        color: rgba(255,255,255,0.8);
        padding-left: 5%;
        text-decoration: none;
        transition: font-size 0.5s ease, color 0.5s ease;
    }
    h1:hover{
        font-size: 0.68rem;
        text-decoration: underline;
        color: white;
        &.logout{
            color: black;
        }
    }
    .active{
        color: white;
        text-decoration: underline;
    }
    .logout{
        width: 55%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #D9D9D9;
        color: black;
        border-radius: 32px;
        padding-right: 5%;
    }
`
const LogoBox = styled(FlexBox)`
    width: 10%;
    height: 40%;
    min-width: 6rem;
    min-height: 3rem;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: transform 0.5s ease;
    &:hover{
        transform: scale(1.1);
    }
    img{
        width: 45%;
        height: auto;
    }
    h1{
        font-size: 1.2rem;
        font-weight: bold;
        color: black;
    }
`