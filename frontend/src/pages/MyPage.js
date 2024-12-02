import styled from "styled-components";
import { FlexBox, WidthBlock, Wrapper } from "../styles/styled";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GrDocumentUser } from "react-icons/gr";
import { CiCircleCheck, CiWarning } from "react-icons/ci";
import { apiAdvise, apiGetMyPage, apiUploadFile } from "../apis";
import useLogin from "../hooks/useLogin";
import { useEffect, useState } from "react";
import runkirin from "../images/runningkirin.png";
import close from "../images/Close.svg"
import AdviseButton from "../components/AdviseButton";
import LoadingComponent from "../components/LoadingComponet";

function MyPage() {
    useLogin();
    const token = sessionStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [adviseModal, setAdviseModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const colorList = [
        "#FFB700",  // 머스타드
        "#5678FF",  // 아쿠아블루
        "#27AE60",  // 초록색
        "#C0392B",  // 빨강
        "#E67E22",  // 다크 오렌지
        "#B6C5FF",  // 밝은 파랑
    ];
    const fetchMyPage = async () => {
        setLoading(true);
        try {
            const response = await apiGetMyPage(token);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching mypage:', error);
        }
        finally {
            setLoading(false);
        }
    }
    const [adviseInfo, setAdviseInfo] = useState({
    });
    const formatKey = (key) => {
        if (key === "ai" || key === "cs" || key === "ds") {
            return key.toUpperCase(); // AI, CS, DS는 모두 대문자
        } else {
            return key.charAt(0).toUpperCase() + key.slice(1); // 나머지는 첫 글자만 대문자
        }
    };
    const getTotalSkillLevel = (skillLevel) => {    // 역량 총 합 반환하는 함수
        return Object.values(skillLevel).reduce((total, value) => total + value, 0);
    };
    const [userInfo, setUserInfo] = useState({
        "name": "로딩 중..",
        "year": "로딩 중..",
        "fileUpload": false,
        "averageGrade": 0.0,
        "updateTime": '',
        skillLevel: {
            "algorithm": 0,
            "language": 0,
            "server": 0,
            "cs": 0,
            "ds": 0,
            "ai": 0
        }
    })
    const [data, setData] = useState([
        { name: 'Algorithm', value: 0 },
        { name: 'Language', value: 0 },
        { name: 'Server', value: 0 },
        { name: 'CS', value: 0 },
        { name: 'DS', value: 0 },
        { name: 'AI', value: 0 },
    ]);
    const FileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await FileSubmit(file); // 파일 선택과 동시에 서버에 업로드
        }
    };
    const FileSubmit = async (file) => {
        try {
            apiUploadFile(file, token)
                .then(response => {
                    alert(response.message);
                    window.location.reload();
                }) // 비동기 호출
        } catch (error) {
            console.log('Error uploading file:', error); // 오류 처리
        }
    };
    const AdviseClick = () => {
        setModalLoading(true);
        setAdviseModal(true);
        try {
            apiAdvise(token)
                .then(response => {
                    if (response.data.isSuccess) {
                        setAdviseInfo(response.data.result);
                        setModalLoading(false);
                        console.log(response.data.result);
                    }
                    else {
                        alert(response.data.message);
                    }
                })
        }
        catch (error) {
            console.log('Error Advise Skill:', error);
        }
    }
    useEffect(() => {
        fetchMyPage();
    }, []);
    // userInfo의 skillLevel을 기반으로 data 초기화
    useEffect(() => {
        const initialData = [
            { name: 'Algorithm', value: userInfo.skillLevel.algorithm, fill: colorList[0] },
            { name: 'Language', value: userInfo.skillLevel.language, fill: colorList[1] },
            { name: 'Server', value: userInfo.skillLevel.server, fill: colorList[2] },
            { name: 'CS', value: userInfo.skillLevel.cs, fill: colorList[3] },
            { name: 'DS', value: userInfo.skillLevel.ds, fill: colorList[4] },
            { name: 'AI', value: userInfo.skillLevel.ai, fill: colorList[5] },
        ];
        setData(initialData); // 초기 데이터 설정
    }, [userInfo]); // userInfo가 변경될 때마다 데이터 업데이트
    return (
        <Wrapper>
            {loading ? (<WidthBlock></WidthBlock>)
                : (<WidthBlock style={{ height: "180vh" }}>
                    <TitleBar>
                        <TitleText>정보</TitleText>
                    </TitleBar>
                    <InformationBlock>
                        <HalfBox>
                            <BoxContainer>
                                <InformationTab>
                                    <InfoTitle style={{ justifyContent: "flex-start" }}>
                                        <IoIosInformationCircleOutline style={{ width: "1.5rem", height: "1.5rem" }} />
                                        &nbsp;
                                        계정
                                        {/** <Button style={{ width: "4rem", height: "1.6rem" }}>Change</Button> */}
                                    </InfoTitle>
                                    <ContentContainer>
                                        <Column style={{ width: "100%", height: "100%" }}>
                                            <Row style={{ fontWeight: "bold" }}>
                                                <Label>이름</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "bold" }}>
                                                <Label>학번</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "bold" }}>
                                                <Label>학점</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "bold" }}>
                                                <Label>아이디</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "bold" }}>
                                                <Label>비밀번호</Label>
                                            </Row>
                                        </Column>
                                        <Divider />
                                        <Column style={{ width: "100%", height: "100%" }}>
                                            <Row style={{ fontWeight: "500" }}>
                                                <Label>{userInfo.name}</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "500" }}>
                                                <Label>{userInfo.year.substring(2)}학번</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "500" }}>
                                                <Label>{userInfo.fileUpload ? userInfo.averageGrade : "기이수 X"}</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "500" }}>
                                                <Label>******</Label>
                                            </Row>
                                            <Row style={{ fontWeight: "500" }}>
                                                <Label>******</Label>
                                            </Row>
                                        </Column>
                                    </ContentContainer>
                                </InformationTab>
                            </BoxContainer>
                        </HalfBox>

                        <HalfBox>
                            <BoxContainer>
                                <InformationTab>
                                    <InfoTitle>
                                        <div>
                                            <GrDocumentUser style={{ width: "1.25rem", height: "1.25rem" }} />
                                            &nbsp;
                                            기이수 과목 정보
                                        </div>
                                        <input type="file" accept=".xlsx, .xls" onChange={FileChange} style={{ display: "none" }} id="file-upload" />
                                        <label htmlFor="file-upload">
                                            <Button style={{ width: "4rem", height: "1.6rem" }}>
                                                Update
                                            </Button>
                                        </label>
                                    </InfoTitle>
                                    <EmptyStateContainer>
                                        {userInfo.fileUpload ? (
                                            <>
                                                <CiCircleCheck style={{ width: "3rem", height: "3rem" }} color="#000" />
                                                <EmptyStateText>최신 정보가 반영되었습니다</EmptyStateText>
                                                <EmptyStateDescription>
                                                    마지막 업데이트: {userInfo.updateTime}
                                                </EmptyStateDescription>
                                            </>
                                        ) : (
                                            <>
                                                <CiWarning style={{ width: "3rem", height: "3rem" }} color="#000" />
                                                <EmptyStateText>아직 입력된 과목이 없습니다</EmptyStateText>
                                                <EmptyStateDescription>
                                                    Update 버튼을 클릭하여 기이수 과목을 입력해주세요
                                                </EmptyStateDescription>
                                            </>
                                        )}
                                    </EmptyStateContainer>
                                </InformationTab>
                            </BoxContainer>
                        </HalfBox>
                    </InformationBlock>
                    <TitleBar>
                        <TitleText>수업 역량 분포도</TitleText>
                    </TitleBar>
                    <AdviseButton onClick={() => { { AdviseClick() } }} />
                    <ChartBlock>
                        {userInfo.fileUpload ?
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%" // 중심점 x좌표 (상대적 값 가능)
                                        cy="50%" // 중심점 y좌표 (상대적 값 가능)
                                        outerRadius="75%" // 원의 반지름 (상대적 또는 절대값 가능)
                                        fill="fill" // 색상
                                        label // 섹션 레이블 표시
                                    />
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer> :
                            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>기이수 파일 업로드 부탁드립니다..! 🙏 </p>
                        }
                    </ChartBlock>
                    {adviseModal ?
                        <ModalBlock>
                            <Overlay onClick={() => setAdviseModal(false)} />
                            <Modal>
                                {
                                    modalLoading ?
                                        <LoadingComponent /> :
                                        <>
                                            <AdviseHeader>
                                                <div style={{ width: "20%", display: "flex", flexDirection: "row", alignItems: "center", gap: "5%" }}>
                                                    <img src={runkirin} />
                                                    <p>분석 결과</p>
                                                </div>
                                                <img src={close} style={{ width: "1.2rem", cursor: "pointer" }} onClick={() => setAdviseModal(false)} />
                                            </AdviseHeader>
                                            <Table>
                                                {Object.entries(adviseInfo).map(([key, value], index) => (
                                                    <Reason>
                                                        <h1>
                                                            {index + 1}. {formatKey(key)} 수치:
                                                            <SkillBar color={colorList[index]} width={userInfo.skillLevel[key] / getTotalSkillLevel(userInfo.skillLevel) || 0} />
                                                            {(userInfo.skillLevel[key] / getTotalSkillLevel(userInfo.skillLevel)).toFixed(2) * 100} %
                                                        </h1>
                                                        <h2>{value[1]}</h2>
                                                    </Reason>
                                                ))}
                                            </Table>
                                        </>
                                }
                            </Modal>
                        </ModalBlock>
                        : <></>
                    }
                </WidthBlock>)
            }
        </Wrapper >
    )
}
const SkillBar = styled.div`
    background-color: ${(props) => props.color}; 
    height: 60%;
    width: ${(props) => props.width * 100}%; /* 막대의 너비 */
    border-radius: 0.25rem;
`;
const Table = styled.div`
    display: grid;
    width: 88%;
    height: 100%;
    grid-template-columns:repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr); 
    font-size: 0.6rem;
    gap: 2%;
    overflow-y: auto;
`;
const Reason = styled(FlexBox)`
    width: 100%;
    height: 100%;
    padding: 2% 4%;
    flex-direction: column;
    border: 1px solid #bebebe;
    border-radius: 1rem;
    gap: 5%;
    h1{
        height: 20%;
        font-size: 0.7rem;
        font-weight: 700;
        border-bottom: 1px solid #bebebe;
        display: flex;
        gap: 2%;
        align-items: center;
        overflow: hidden;
    }
    h2{
        height: 65%;
        font-weight: 400;
        font-size: 0.6rem;
    }
`
const ModalBlock = styled(FlexBox)`
    position: fixed;
    width: 100vh;
    height: 100vh;
    z-index: 5;
`
const AdviseHeader = styled(FlexBox)`
    width: 100%;
    height: 6%;
    border-bottom: 2px solid #bebebe;
    justify-content: space-between;
    align-items: center;
    p{
        font-weight: bold;
        font-size: 0.8rem;
    }
    img{
        width: 1.5rem;
    }
`
const Overlay = styled(FlexBox)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    z-index: 10; /* 폼보다 위에 위치 */
    justify-content: center;
    align-items: center;
`
const Modal = styled(FlexBox)`
    position: fixed;
    top: 0;
    left: 0;
    margin-left: 5%;
    margin-top: 2.5%;
    width: 90%;
    height: 90%;
    border-radius: 1rem;
    background-color: white;
    flex-direction: column;
    align-items: center;
    padding: 4%;
    gap: 4%;
    z-index: 20; /* 오버레이보다 위에 위치 */
`
const ChartBlock = styled(FlexBox)`
    width: 100%;
    height: 35%;
    justify-content: center;
    align-items: center;
`
const InformationBlock = styled(FlexBox)`
    width: 100%;
    min-height: 25rem;
`

const TitleBar = styled(FlexBox)`
    width: 100%;
    height: 6.25rem;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const TitleText = styled.span`
    width: 30%;
    padding: 1rem 0.125rem;
    font-weight: bold;
    border-top: 1.5px solid;
    border-bottom: 1.5px solid;
`;

const HalfBox = styled(FlexBox)`
    width: 50%;
    height: auto;
    justify-content: center;
    align-items: center;
`;

const BoxContainer = styled.div`
    width: 60%;
    border: 1px solid #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

const InformationTab = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 1.5rem;
    flex: 1;
`;

const InfoTitle = styled.div`
    padding: 8px 0;
    border-bottom: 1px solid #404040;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
`;

const Button = styled(FlexBox)`
    margin-left: auto;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 0.35rem;
    background-color: black;
    color: white;
    cursor: pointer;
    font-size: 0.6rem;
    transition: transform 0.5s ease;
    &:hover {
        transform: scale(1.05);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    width: 100%;
    flex: 1;
`;

const Column = styled.div`
    flex: 1;
    padding: 0 1rem;
    height: 100%;
`;

const Divider = styled.div`
    width: 1px;
    background-color: black;
    margin: 0 1rem;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
`;

const Label = styled.span`
    min-width: 4rem;
    font-size: 0.7rem;
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    height: 100%;
`;

const EmptyStateIcon = styled.div`
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #666;
`;

const EmptyStateText = styled.div`
    font-size: 1rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.5rem;
`;

const EmptyStateDescription = styled.div`
    font-size: 0.7rem;
    color: #000;
    text-align: center;
`;

export default MyPage;