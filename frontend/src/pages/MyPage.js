import styled from "styled-components";
import { FlexBox, WidthBlock, Wrapper } from "../styles/styled";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GrDocumentUser } from "react-icons/gr";
import { CiCircleCheck, CiWarning } from "react-icons/ci";
import { apiGetMyPage, apiUploadFile } from "../apis";
import useLogin from "../hooks/useLogin";
import { useEffect, useState } from "react";

function MyPage() {
    useLogin();
    const token = sessionStorage.getItem('token');
    const [loading, setLoading] = useState(true);
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
            {loading ? (<WidthBlock></WidthBlock>) :
                (<WidthBlock style={{ height: "170vh" }}>
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

                </WidthBlock>)
            }
        </Wrapper >
    )
}
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