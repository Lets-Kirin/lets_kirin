import { WidthBlock, Wrapper, FlexBox } from "../styles/styled";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/kirinlogo.png";
import signuplogo from "../images/runningkirin.png";
import arrow from "../images/arrow-right-solid.svg";
import github from "../images/github-solid-black.svg";
import { apiSignUp } from "../apis";

function SignUp() {
    const navigate = useNavigate();
    const [signUpData, setSignUpData] = useState({
        id: '',
        pw: '',
        confirmpw: '',
        name: '',
        year: '',
        semester: '',
        department: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const generateSemesterOptions = () => {
        const options = [];
        for (let grade = 1; grade <= 4; grade++) {
            for (let sem = 1; sem <= 2; sem++) {
                const semester = `${String(grade)}-${String(sem)}`;
                options.push(semester);
            }
        }
        return options;
    };
    const generateDepartmentOptions = () => {
        const options = [
            "건축공학과",
            "토목공학과",
            "환경에너지공간융합학과",
            "지구정보공학과",
            "에너지자원공학과",
            "기계공학과",
            "항공우주공학과",
            "나노신소재공학과",
            "원자력공학과",
            "전자정보통신공학과",
            "전자공학과",
            "정보통신공학과",
            "컴퓨터공학과",
            "소프트웨어학과",
            "디지털콘텐츠학과",
            "정보보호학과",
            "데이터사이언스학과",
            "AI로봇학과",
            "인공지능학과",
            "인공지능데이터사이언스학과"
        ];
        return options;
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e); // 엔터 키가 눌리면 handleSubmit 호출
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (signUpData.id === '' || signUpData.pw === '' || signUpData.confirmpw === '' || signUpData.name === '' || signUpData.year === '') {
            alert("모든 값을 입력해주세요!");
            return;
        }
        else if (signUpData.pw !== signUpData.confirmpw) {
            alert("비밀번호와 비밀번호 확인이 서로 다릅니다!");
            return;
        }
        else if (Number(signUpData.year) < 2020 || Number(signUpData.year) > 2024) {
            alert("입학연도가 설정 범위와 다릅니다!");
            return;
        }
        else if (signUpData.semester === '') {
            alert("학기를 선택해주세요!");
            return;
        }
        else if (signUpData.department === '') {
            alert("학과를 선택해주세요!");
            return;
        }
        apiSignUp(signUpData)
            .then((response) => {
                if (response.data.isSuccess) {
                    alert(response.data.message);
                    navigate("/login");
                }
                else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                alert(error);
            })
    };

    return (
        <WidthBlock>
            <SignUpContainer>
                <SignUpLogo onClick={() => { navigate(-1); }}>
                    <img src={logo} />
                    <p>Let's<br />Kirin</p>
                </SignUpLogo>
                <SignUpSection>
                    <SignUpFont>
                        <img src={signuplogo} />
                        <p>Sign Up</p>
                    </SignUpFont>
                    <SignUpPart1>
                        <InputBox placeholder="ID" name="id" value={signUpData.id} type="text" onChange={handleChange} bottom={"0px"} radius={"8px 8px 0px 0px"} onKeyDown={handleKeyPress} />
                        <InputBox placeholder="PW" name="pw" value={signUpData.pw} type="password" onChange={handleChange} onKeyDown={handleKeyPress} />
                        <InputBox placeholder="Confirm PW" name="confirmpw" value={signUpData.confirmpw} type="password" onChange={handleChange} top={"0px"} radius={"0px 0px 8px 8px"} onKeyDown={handleKeyPress} />
                    </SignUpPart1>
                    <SignUpPart2>
                        <InputBox2 placeholder="Name" name="name" value={signUpData.name} type="text" onChange={handleChange} bottom={"0px"} radius={"8px 8px 0px 0px"} onKeyDown={handleKeyPress} />
                        <InputBox2 placeholder="Which year did you enter university? [2020~2024]" name="year" value={signUpData.year} type="text" onChange={handleChange} maxLength={4} radius={"0px 0px 8px 8px"} onKeyDown={handleKeyPress} />
                    </SignUpPart2>
                    <SignUpPart3>
                        <SelectContainer>
                            <p>Semester</p>
                            <select value={signUpData.semester} name="semester" onChange={handleChange}>
                                <option value="">선택하세요</option>
                                {generateSemesterOptions().map((time) => (
                                    <option value={time}>{time}</option>
                                ))}
                            </select>
                        </SelectContainer>
                        <SelectContainer>
                            <p>Department</p>
                            <select value={signUpData.department} name="department" onChange={handleChange}>
                                <option value="">선택하세요</option>
                                {generateDepartmentOptions().map((time) => (
                                    <option value={time}>{time}</option>
                                ))}
                            </select>
                        </SelectContainer>
                    </SignUpPart3>
                    <SubmitBtn onClick={handleSubmit}>
                        <p>Let's go and use the Let's Kirin service</p>
                        &nbsp;
                        <img src={arrow} />
                    </SubmitBtn>
                </SignUpSection>
                <GithubImg src={github} onClick={() => { navigate("/"); }} />
            </SignUpContainer>
        </WidthBlock>
    )
}
export default SignUp;
const SignUpContainer = styled(FlexBox)`
    width: 33%;
    height: 100%;
    min-width: 480px;
    padding-top: 2%;
    flex-direction: column;
    align-items: center;
    cursor: default;
    p{
        color: #000;
        font-weight: bold;
    }
    gap: 2%;
`
const SignUpLogo = styled(FlexBox)`
    cursor: pointer;
    width: 30%;
    height: 10%;
    min-width: 160px;
    min-height: 64px;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 10%;
    img{
        width: 50%;
        height: auto;
    }
    p{
        font-size: 24px;
    }
    transition: transform 0.5s ease;
        &:hover{
            transform: scale(1.05);
        }
`
const SignUpSection = styled(FlexBox)`
    width: 100%;
    height: 75%;
    min-height: 550px;
    padding-top: 5%;
    gap: 3%;
    border: 2px solid #404040;
    border-radius: 16px;
    align-items: center;
    flex-direction: column;
`
const SignUpFont = styled(FlexBox)`
    width: 100%;
    height: 10%;
    min-height: 50px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2%;
    img{
        height:55%;
        width: auto;
    }
    p{
        font-size:14px;
    }
`
const SignUpPart1 = styled(FlexBox)`
    width: 70%;
    height: 27%;
    min-height: 150px;
    justify-content: center;
    flex-direction: column;
`
const InputBox = styled.input`
    width: 100%;
    height: 33%;
    border: 1px solid #404040;
    border-top :${({ top }) => `${top}`};
    border-bottom :${({ bottom }) => `${bottom}`};
    border-left :${({ left }) => `${left}`};
    border-right :${({ right }) => `${right}`};
    border-radius: ${({ radius }) => `${radius}`};
    padding-left:8%;
    font-size: 12px;
    font-weight:700;
    color:#404040;
    &::placeholder{
       font-size:12px;
    }
`
const SignUpPart2 = styled(SignUpPart1)`
    height: 18%;
    min-height: 100px;
`
const InputBox2 = styled(InputBox)`
    height: 50%;
`
const SignUpPart3 = styled(SignUpPart1)`
    height: 12%;
    min-height: 70px;
    flex-direction: row;
    gap: 4%;
`
const SelectContainer = styled(FlexBox)`
    width: 48%;
    height: 90%;
    border: 1px solid #404040;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p{
        color: #404040;
        font-size: 12px;
    }
    select{
        width: 80%;
        height:40%;
        border: 1px solid #404040;
        color: #404040;
        background-color: white;
        font-weight: 500;
        font-size: 10px;
        cursor: pointer;
    }
    :focus{
        outline: none;
    }
`
const SubmitBtn = styled.button`
    width: 70%;
    height: 7%;
    min-height: 35px;
    margin-top: 0%;
    background-color: #404040;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    p{
        color: #FFF;
        font-size: 12px;
    }
    img{
        height: 13px;
        width: auto;
    }
    transition: transform 0.5s ease;
        &:hover{
            transform: translateY(-3px);
        }
`
const GithubImg = styled.img`
    margin-top: 6%;
    width: 30px;
    height: auto;
    cursor: pointer;
`