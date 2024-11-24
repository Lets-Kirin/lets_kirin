import styled from "styled-components";
import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FlexBox, WidthBlock, Wrapper } from "../styles/styled";
import logo from "../images/kirinlogo.png";
import mainBack from "../images/mainbackground.png";
import arrow from "../images/arrow-right-solid.svg";
import set from "../images/Setting.svg";
import icon from "../images/Icon.svg";
import copy from "../images/Copy.svg";
import edit from "../images/Edit.svg";
function Main() {
    const navigate = useNavigate();
    return (
        <WidthBlock>
            <MainContainer background={mainBack}>
                <MainHeader>
                    <LogoBox>
                        <img src={logo} alt="기린로고" />
                        <p>Let's Kirin</p>
                    </LogoBox>
                    <LoginBox onClick={() => { navigate("/login"); }}>
                        <p>Log In</p>
                    </LoginBox>
                </MainHeader>
                <MiddleContainer>
                    <MidStartSection>
                        <p>Just upload a file and create your own<br /> personalized timetable</p>
                        <button onClick={() => { navigate("/login"); }}>
                            <p>Get Start</p>
                            &nbsp;
                            <img src={arrow} alt="화살표" />
                        </button>
                    </MidStartSection>
                    <MidTitleSection>
                        <p> We'll Make<br />Your Custom<br />Timetable</p>
                    </MidTitleSection>
                </MiddleContainer>
                <LastContainer>
                    <LastHow>
                        <img src={set} alt="톱니바퀴" />
                        <p>How Can We Make Your <br />Custom Timetable ?</p>
                    </LastHow>
                    <LastContent>
                        <img src={icon} alt="폴더" />
                        <p>First.<br />We get information about the<br />user from the file you uploaded</p>
                    </LastContent>
                    <LastContent>
                        <img src={edit} alt="수정" />
                        <p>Second.<br />Enter the day off you want and<br />the class you want</p>
                    </LastContent>
                    <LastContent>
                        <img src={copy} alt="복사" />
                        <p>Third.<br />Just refer to the<br />timetable set for you</p>
                    </LastContent>
                </LastContainer>
            </MainContainer >
            <Footer />
        </WidthBlock>

    )
}

export default Main;

const MainContainer = styled(WidthBlock)`
   background-image:${({ background }) => `url(${background})`};
   background-position: center; /* 이미지를 중앙에 배치 */
   background-size: cover; /* 이미지의 크기를 요소에 맞춤 */
    background-repeat: no-repeat; /* 이미지를 반복하지 않음 */
    background-attachment: fixed; /* 배경을 고정 */
    cursor: default;
    p{
    color: #FFF;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
`

const MainHeader = styled(FlexBox)`
width: 100%;
height: 11%;
align-items: center;
justify-content: space-between;
padding-left: 2%;
padding-right: 2%;
`
const LogoBox = styled(FlexBox)`
width: 10%;
height: 55%;
justify-content: center;
align-items: center;
img{
    height: 90%;
    width: auto;
}
p{  
    text-align: center;
    width: 50%;
    font-weight: bold;
    font-size: 1rem;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
transition: transform 0.5s ease;
        &:hover{
            transform: scale(1.05);
        }
`
const LoginBox = styled(FlexBox)`
    cursor: pointer;
    width: 6%;
    height: 35%;
    p{
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        transition: transform 0.5s ease;
        &:hover{
            transform: translateY(-3px);
            transform: scale(1.1);
        }
    }
`
const MiddleContainer = styled(FlexBox)`
    width: 100%;
    height: 40%;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding-left: 5%;
    padding-right: 5%;
`
const MidStartSection = styled(FlexBox)`
    margin-top: 10%;
    width: 30%;
    height: 60%;
    flex-direction: column;
    justify-content: center;
    p{
        font-size: 0.85rem;
    }
    img{
        height: 0.65rem;
        width: auto;
    }
    button{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 4%;
        margin-left: 2%;
        width: 30%;
        height: 15%;
        border-radius: 0.4rem;
        background: #404040;
        p{
            font-size: 0.65rem;
        }
        transition: transform 0.5s ease;
        &:hover{
            transform: translateY(-3px);
            transform: scale(1.05);
        }
    }
`
const MidTitleSection = styled(FlexBox)`
    width: 40%;
    height: 85%;
    p{
        font-size: 4rem;
        font-weight: bold;
    }
`
const LastContainer = styled(FlexBox)`
    width: 92%;
    height: 40%;
    background-color: rgba(255,255,255,0.30);
    border-radius: 1rem;
    padding-left: 4%;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    text-align: center;
`
const LastHow = styled(FlexBox)`
    width: 30%;
    height: 100%;
    padding-top: 5%;
    gap: 5%;
    flex-direction: column;
    align-items: center;
    text-align: center;
    p{
        font-size: 1.5rem;
        font-weight: bold;
    }
    img{
        width: 4rem;
        height: auto;
    }
`
const LastContent = styled(FlexBox)`
    width: 23%;
    height: 75%;
    gap: 5%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    img{
        width: 4rem;
        height: auto;
    }
    p{
        font-size: 0.75rem;
        font-weight: bold;
    }
`