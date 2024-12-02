import styled from "styled-components";
import { useState, useEffect } from "react";
import { FlexBox, GridBox, Wrapper } from "../styles/styled";
import { apiGetTimeTable, apiUploadFile } from "../apis";
import useLogin from "../hooks/useLogin";
import arrow from "../images/arrow-right-solid.svg";
import add from "../images/Add_Time.svg";
import runKirin from "../images/runningkirin.png";
import { useLocation, useNavigate } from "react-router-dom";
function Timetable() {
    useLogin();
    const location = useLocation();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    // 선택된 항목의 인덱스를 상태로 저장
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [timetable, setTimetable] = useState({});
    const [loading, setLoading] = useState(true);
    const dayMap = {
        "월": 2,
        "화": 3,
        "수": 4,
        "목": 5,
        "금": 6,
    };
    const colorList = [
        "rgb(255, 183, 0)",   // 머스타드
        "rgb(86, 120, 255)",   // 아쿠아블루
        "rgb(39, 174, 96)",  // 초록색
        "rgb(212, 160, 255)", // 연보라
        "rgb(230, 126, 34)", // 다크 오렌지
        "rgb(182, 197, 255)", //밝은 파랑
        "rgb(192, 57, 43)",  // 진한 빨강
        "rgb(255, 138, 140)", // 밝은 빨강
        "rgb(52, 152, 219)", // 진한 청색 
        "rgb(170, 170, 170)"   // 밝은 회색
    ];

    // 시작 시간과 종료 시간을 기반으로 그리드 행 계산
    const calculateGridRow = (startTime, endTime) => {
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);
        const startRow = (startHour - 9) * 2 + (startMin >= 30 ? 1 : 0); // 30분이면 한 칸 더 아래로
        const endRow = (endHour - 9) * 2 + (endMin >= 30 ? 1 : 0);
        return { startRow, endRow };
    };
    const handleListClick = (index) => {
        setSelectedIndex(index); // 클릭한 항목의 인덱스를 상태에 저장
    };
    const fetchTimetable = async () => {
        setLoading(true); // 데이터 로드 시작
        try {
            const response = await apiGetTimeTable(token);
            const fetchedTimetable = response.data.result;

            // fetchedTimetable의 recommendedCourses를 정렬합니다.
            if (fetchedTimetable && fetchedTimetable.recommendedCourses && fetchedTimetable.recommendedCourses.length > 0) {
                const sortedCourses = [...fetchedTimetable.recommendedCourses].sort((a, b) => a.courseID - b.courseID);
                // 정렬된 결과로 timetable 업데이트
                setTimetable({
                    ...fetchedTimetable,
                    recommendedCourses: sortedCourses
                });
                console.log(location);
                // 커스텀 페이지에서 왔는지 확인
                if (location.state && location.state.custom) {
                    setSelectedIndex(sortedCourses.length - 1); // 마지막 추천 시간표 선택
                } else {
                    setSelectedIndex(0); // 기본 첫 번째 선택
                }
            } else {
                setTimetable(fetchedTimetable); // recommendedCourses가 없으면 그대로 설정
            }
        } catch (error) {
            console.error('Error fetching timetable:', error);
        } finally {
            setLoading(false);
        }
    };
    const FileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            FileSubmit(file); // 파일 선택과 동시에 서버에 업로드
        }
    };
    const FileSubmit = (file) => {
        try {
            apiUploadFile(file, token)
                .then(response => {
                    alert(response.message);
                    navigate('/mypage');
                }) // 비동기 호출
        } catch (error) {
            console.log('Error uploading file:', error); // 오류 처리
        }
    };
    useEffect(() => {
        fetchTimetable();
    }, []);
    return (
        <Wrapper>
            {loading ? (<FileWidthBlock></FileWidthBlock>) :
                (!timetable.fileUpload ?
                    <FileWidthBlock >
                        <h1>NOT FOUND 404 <br />너의 수업은?</h1>
                        <h2>We still don't have any information about you...<br />파일 업로드 부탁드립니다...🙏</h2>
                        <input type="file" accept=".xlsx, .xls" onChange={FileChange} style={{ display: "none" }} id="file-upload" />
                        <label htmlFor="file-upload">
                            <FileButton>
                                <p>Add File </p>
                                &nbsp;
                                <img src={arrow} />
                            </FileButton>
                        </label>
                    </FileWidthBlock>
                    :
                    <TimeTableWidthBlock>
                        <TimeList>
                            <User>
                                <p>{timetable.year % 2000}학번 {timetable.userName}</p>
                                <img src={add} onClick={() => navigate('/custom')} />
                            </User>
                            <ListBlock>
                                {timetable.recommendedCourses.map((semester, index) => (
                                    <List key={semester.courseID} className={selectedIndex === index ? 'select' : 'wait'} onClick={() => handleListClick(index)} >
                                        Let's Kirin 추천 {index + 1}
                                    </List>
                                ))}
                            </ListBlock>
                        </TimeList>
                        <TableBlock>
                            <DayHeader style={{ gridColumn: '1 / span 1' }}><img src={runKirin} alt="KirinLogo" /></DayHeader>
                            <DayHeader style={{ gridColumn: '2 / span 1' }}>월요일</DayHeader>
                            <DayHeader style={{ gridColumn: '3 / span 1' }}>화요일</DayHeader>
                            <DayHeader style={{ gridColumn: '4 / span 1' }}>수요일</DayHeader>
                            <DayHeader style={{ gridColumn: '5 / span 1' }}>목요일</DayHeader>
                            <DayHeader style={{ gridColumn: '6 / span 1' }}>금요일</DayHeader>
                            {Array.from({ length: 13 }, (_, index) => {
                                const hour = 9 + index
                                const timeLabel = `${String(hour).padStart(2, '0')}:00`;
                                return (
                                    <TimeSlot key={`time-slot-${index}`} style={{ gridColumn: '1', gridRow: `${index * 2 + 2} / ${index * 2 + 4}` }}>{timeLabel}</TimeSlot>
                                );
                            })}
                            {Array.from({ length: 13 }, (_, index) => {
                                return Array.from({ length: 5 }, (_, i) => { // 5는 2부터 6까지의 열 수
                                    return (
                                        <TimeSlot
                                            key={`grid-slot-${index}-${i}`}
                                            style={{
                                                gridColumn: `${i + 2}`, // 2부터 6까지
                                                gridRow: `${index * 2 + 2} / ${index * 2 + 4}`
                                            }}
                                        ></TimeSlot>
                                    );
                                });
                            })}

                            {selectedIndex !== -1 && timetable.recommendedCourses[selectedIndex].courses.map((course, index) =>
                                course.schedules.map((schedule, sIndex) => {
                                    const [startTime, endTime] = schedule.courseTime.split("-");
                                    const { startRow, endRow } = calculateGridRow(startTime, endTime);
                                    return (
                                        <CourseBlock
                                            key={`${index}-${sIndex}`}
                                            day={dayMap[schedule.courseDay]}
                                            startrow={startRow + 2}  // CSS grid는 1부터 시작
                                            endrow={endRow + 2}
                                            color={colorList[index]}
                                        >
                                            {course.courseName} <br /> {course.professor_name} <br /> {schedule.classroom}
                                        </CourseBlock>
                                    );
                                })
                            )}
                        </TableBlock>
                    </TimeTableWidthBlock>)
            }
        </Wrapper>
    )
}
export default Timetable;
const FileWidthBlock = styled(FlexBox)`
    flex-direction: column;
    width: 100vw;
    height: 82vh;
    justify-content: center;
    align-items: center;
    gap: 20px;
    color: black; 
    text-align: center;
    h1{
        font-weight: 900;
        font-size: 6rem;
    }
    h2{
        font-weight: 700;
        font-size: 1rem;
    }
`
const FileButton = styled(FlexBox)`
    width: 12%;
    height: 5%;
    min-width: 160px;
    min-height: 40px;
    cursor: pointer;
    background-color: #404040;
    border-radius: 20px;
    color: white;
    justify-content: center;
    align-items: center;
    p{
        font-size: 0.8rem;
    }
    img{
        width: 0.8rem;
        height: auto;
    }
    @media screen and (max-width: 1000px){
        p{
            font-size: 12px;
        }
        img{
            width: 12px;
            height: auto;
        }
    }
    @media screen and (min-width: 1600px){
        p{
            font-size: 16px;
        }
        img{
            width: 16px;
            height: auto;
        }
    }
`
const TimeTableWidthBlock = styled(FlexBox)`
    width: 100vw;
    height: 82vh;
    justify-content: center;
    align-items: center;
    gap: 5%;
`
const TimeList = styled(FlexBox)`
    width: 16%;
    height: 85%;
    gap: 2%;
    flex-direction: column;
    font-family: sans-serif;
    overflow-y: hidden;
`
const User = styled(FlexBox)`
    width: 100%;
    height: 6%;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    p{
        color: #404040;
        font-size: 0.8rem;
        font-weight: 700;
        margin-left: 30%;
    }
    img{
        width: 1.8rem;
        height: auto;
        cursor: pointer;
        transition: transform 0.5s ease; 
        &:hover{
            transform: scale(1.10);
        }
    }
`
const ListBlock = styled(FlexBox)`
    width: 100%;
    height: 90%;
    flex-direction: column;
    align-items:center;
    gap: 4%;
    overflow-y:auto;
    padding: 10px;
    box-sizing: border-box; /* padding이 요소의 전체 크기에 포함되도록 설정 */
    overscroll-behavior: none; /* 스크롤이 전체화면으로 넘어가는거 방지 */
`
const List = styled(FlexBox)`
    width: 95%;
    height: 9%;
    border: 1px solid black;
    border-radius: 32px;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.5s ease, background-color 0.5s ease; 
    &.select{
        color: white;
        background-color: black;
        border: 1px solid black;
        transform: translateY(-6px);
        box-shadow: 4px 10px 10px rgba(0, 0, 0, 0.2);
    }
    &.wait{
        color: black;
        background-color: white;
        border: 1px solid black;
    }
    &:hover{
        transform: scale(1.05);
        transform: translateY(-6px);
        box-shadow: 4px 10px 10px rgba(0, 0, 0, 0.2); 
    }
`
const TableBlock = styled(GridBox)`
    width: 70%;
    height: 85%;
    grid-template-columns: 0.5fr repeat(5, 1fr); /* 시간 열 + 5일 */
    grid-template-rows: repeat(27, 1fr); /* 1시간 단위로 13행 */
    border: 0.8px solid #BEBEBE;
    position: relative;
`
const DayHeader = styled(FlexBox)`
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.7rem;
    background-color: #F1F1F1;
    border-right: 0.8px solid #BEBEBE;
    &:first-of-type{
        border:0px;
        border-right: 0.8px solid #BEBEBE;
    }
    img{
        width: 1.8rem;
        height: auto;
    }
`
const TimeSlot = styled(FlexBox)`
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    border: 0.8px solid #BEBEBE;
    border-left: 0; 
    border-bottom: 0;
`
const CourseBlock = styled(FlexBox)`
    background-color: ${(props) => props.color || '#fff'};
    grid-column: ${(props) => props.day};
    grid-row: ${(props) => props.startrow} / ${(props) => props.endrow};
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.6rem;
    text-align: center;
    overflow: hidden;
    padding: 10px;
    color: white;
`