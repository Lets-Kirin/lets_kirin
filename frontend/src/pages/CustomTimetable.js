import { useLocation, useNavigate } from "react-router-dom";
import { WidthBlock, FlexBox } from "../styles/styled";
import runkirin from "../images/runningkirin.png";
import styled from "styled-components";
import close from "../images/Close.svg";
import arrow from "../images/arrow-right-solid.svg";
import trash from "../images/Trash.svg";
import add from "../images/Add_square.svg";
import search from "../images/Search.svg";
import LoadingComponent from "../components/LoadingComponet.js";
import { useState, useEffect } from "react";
import { apiRecommendTimetable } from "../apis.js";
import useLogin from "../hooks/useLogin.js";
function CustomTimetable() {
    useLogin();
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showReason, setShowReason] = useState(false);
    const [timeoffModal, setTimeoffModal] = useState(false);
    const [dayoff, setDayoff] = useState();
    const [credit, setCredit] = useState();
    const [timeState, setTimeState] = useState({    // 공강 시간 배열 
        startTime: '',
        endTime: '',
        day: ''
    });
    const [idx, setIdx] = useState(0);  // 공강 시간 선택시 인덱스 관리
    const [courseArray, setCourseArray] = useState(
        [{
            "id": "",
            "courseName": "",
            "professorName": "",
            "classroom": "",
            "courseDay": "",
            "courseTime": "",
            "courseNumber": ""
        },]
    )
    const [timeoffArray, setTimeoffArray] = useState(
        [{
            "day": "",
            "time": ""
        },
        ]
    )
    const [reasonCourse, setReasonCourse] = useState([]);
    const createRequest = () => {
        if (!(Number(credit) >= 12 && Number(credit) <= 21)) {
            alert("학점 입력 부분 다시 한번 확인 부탁드립니다 🙏");
            return;
        }
        else {
            const requestBody = {
                coursePriority: courseArray
                    .filter(course => course.courseName && course.professorName && course.courseTime) // 필터링 조건
                    .map(course => ({
                        courseName: course.courseName,
                        courseNumber: course.courseNumber,
                        sectionNumber: course.sectionNumber,
                        professorName: course.professorName,
                        courseTime: course.courseTime,
                        courseDay: course.courseDay,
                        credit: course.credits,
                        classroom: course.classroom,
                        id: course.id,
                        department_major: course.department_major,
                        courseClassification: course.courseClassification
                    })),
                timeoff: timeoffArray
                    .filter(timeoff => timeoff.day && timeoff.time)
                    .map(timeoff => ({
                        day: timeoff.day,
                        time: timeoff.time
                    })),
                dayoff: [dayoff],
                credit: Number(credit)
            }
            postRequest(requestBody);
            return;
        }
    }
    const postRequest = (requestBody) => {
        setLoading(true);
        apiRecommendTimetable(token, requestBody)
            .then(response => {
                if (response.data.isSuccess) {
                    setReasonCourse(response.data.result.result.courses);
                    setLoading(false)
                    setShowReason(true);
                }
                else {
                    alert(response.data.message);
                    navigate('/timetable');
                }
            })
            .catch(error => {
                alert(error);
                navigate('/timetable');
            })
    }
    const clearTime = () => {
        setTimeState('', '', '');
    }
    const updateStartTime = (newTime) => {
        setTimeState(prev => ({ ...prev, startTime: newTime }));
    };
    const updateEndTime = (newTime) => {
        setTimeState(prev => ({ ...prev, endTime: newTime }));
    };
    const updateDay = (newDay) => {
        setTimeState(prev => ({ ...prev, day: newDay }));
    }
    const updateTimeoffArray = () => {  // 모달에서 선택된 시간 값들을 timeoffArray에 선택된 인덱스에 해당하는 칸에 업데이트
        if (compareTime()) {
            setTimeoffArray(prev =>
                prev.map((item, i) =>
                    i === idx ? { day: timeState.day, time: `${timeState.startTime}-${timeState.endTime}` } : item));
            clearTime();
            setTimeoffModal(false);
        }
        else {
            return;
        }
    }
    // 30분 단위로 시간 옵션 생성
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 9; hour < 21; hour++) {
            for (let minute of [0, 30]) {
                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                options.push(time);
            }
        }
        return options;
    };
    const compareTime = () => {
        if (timeState.startTime === undefined || timeState.endTime === undefined) {
            alert("아직 시간이 선택되지 않았습니다 !");
            return false;
        }
        else if (timeState.day === undefined) {
            alert("아직 요일이 선택되지 않았습니다!");
            return false;
        }
        else {
            const [startHour, startMin] = timeState.startTime.split(':').map(Number);
            const [endHour, endMin] = timeState.endTime.split(':').map(Number);
            if (startHour * 60 + startMin + 180 < endHour * 60 + endMin) {
                alert("시간은 최대 3시간까지 선택 가능합니다 !");
                return false;
            }
            else if (startHour * 60 + startMin > endHour * 60 + endMin) {
                alert("종료 시간이 시작 시간보다 빠릅니다 !");
                return false;
            }
            else {
                return true;
            }
        }
    }
    const dayoffHandle = (now) => { // 공강 날짜 취소 (현재 금요일 선택되어있을때 금요일 다시 선택 시 checked 취소 및 undefined)
        if (dayoff === now) {
            setDayoff();
        }
        else {
            setDayoff(now);
        }
    }
    const addCourse = () => {
        setCourseArray(prev => {
            if (prev.length < 4) {
                return [...prev, { "id": "", "courseName": "", "professorName": "", "classroom": "", "courseDay": "", "courseTime": "", "courseNumber": "" }];
            }
            return prev; // 이미 4개인 경우 기존 배열 유지
        });
    };

    const addTimeoff = () => {
        setTimeoffArray(prev => {
            if (prev.length < 4) {
                return [...prev, { "day": "", "time": "" }]
            }
            return prev;
        });
    }
    const trashTimeoff = (index) => {   // 선택한 인덱스에 해당하는 값 지우고 칸 당기기
        setTimeoffArray(prev => prev.filter((_, i) => i !== index));
    }
    const trashCourse = (index) => {
        setCourseArray(prev => prev.filter((_, i) => i !== index));
    }
    useEffect(() => {
        if (location.state && location.state.item) { // 수업 선택하는 페이지에서 커스텀 페이지 이동 시, 선택한 수업을 추가해서 리스트를 받아옴
            setCourseArray(location.state.item);
            console.log(location.state.item[0]);
            setCredit(location.state.credit);
            setDayoff(location.state.dayoff);
            setTimeoffArray(location.state.timeoff);
        }
    }, [location.state]);
    return (
        <FormBackground>
            {loading ?
                <FormBlock style={{ justifyContent: "center" }}>
                    <LoadingComponent />
                </FormBlock>
                :
                showReason ?
                    <FormBlock style={{ gap: "2%" }}>
                        <CustomHeader style={{ justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <img src={runkirin} /><h1>추천 시간표</h1>
                            </div>
                            <button onClick={() => navigate('/timetable')}>확인</button >
                        </CustomHeader>
                        <Table>
                            {reasonCourse.map((item, index) => (
                                <Reason>
                                    <h1><span>{index + 1} .</span> [{item.courseName}] [{item.professorName}]
                                        [
                                        {item.schedules.map((schedule, idx) => (
                                            `${schedule.courseDay} ${schedule.courseTime}${idx < item.schedules.length - 1 ? ', ' : ''}`
                                        ))}
                                        ]
                                    </h1>
                                    <h2>{item.description}</h2>
                                </Reason>
                            ))}
                        </Table>
                    </FormBlock>
                    : <FormBlock>
                        <BackButton><img src={close} onClick={() => navigate('/timetable')} /></BackButton>
                        <CustomHeader><h1>시간표 구성하기</h1></CustomHeader>
                        <FormHearder><h1>수업 우선순위 (최대 4개)</h1><h2 onClick={addCourse}>Add <img src={add} /></h2></FormHearder>
                        <FormContainer>
                            {[...Array(4)].map((_, index) => (
                                <FormContent key={index} className={index < courseArray.length ? "" : "wait"}>
                                    <h1>{index + 1}.</h1>
                                    <div onClick={() => { navigate('/select', { state: { idx: index, item: courseArray, timeoff: timeoffArray, credit: credit, dayoff: dayoff } }) }}>
                                        <p>{index < courseArray.length && courseArray[index].courseName !== ""
                                            ? `${courseArray[index].courseName} / ${courseArray[index].professorName} / ${courseArray[index].courseDay} ${courseArray[index].courseTime} / ${courseArray[index].classroom}`
                                            : ""}</p>
                                        <img src={search} />
                                    </div>
                                    <img src={trash} onClick={() => trashCourse(index)} />
                                </FormContent>
                            ))}
                        </FormContainer>
                        <FormHearder><h1>공강 시간 (최대 4개)  (칸 별 최대 3시간)</h1><h2 onClick={addTimeoff}>Add <img src={add} /></h2></FormHearder>
                        <FormContainer>
                            {[...Array(4)].map((_, index) => (
                                <FormContent key={index} className={index < timeoffArray.length ? "" : "wait"}>
                                    <h1>{index + 1}.</h1>
                                    <div onClick={() => { setTimeoffModal(true); setIdx(index); }}>
                                        <p>{index < timeoffArray.length && timeoffArray[index].day !== ""
                                            ? `${timeoffArray[index].day} / ${timeoffArray[index].time}`
                                            : ""}</p>
                                        <img src={search} />
                                    </div>
                                    <img src={trash} onClick={() => trashTimeoff(index)} />
                                </FormContent>
                            ))}
                        </FormContainer>
                        <FormRest>
                            <Dayoff>
                                <h1>공강 날짜</h1>
                                <div>
                                    <label className="radio-label"><p>월요일</p><input type="radio" name="day" value="월요일" checked={dayoff === "월요일"} onClick={(e) => dayoffHandle(e.target.value)} /><span className="custom-radio"></span></label>
                                    <label className="radio-label"><p>화요일</p><input type="radio" name="day" value="화요일" checked={dayoff === "화요일"} onClick={(e) => dayoffHandle(e.target.value)} /><span className="custom-radio"></span></label>
                                    <label className="radio-label"><p>수요일</p><input type="radio" name="day" value="수요일" checked={dayoff === "수요일"} onClick={(e) => dayoffHandle(e.target.value)} /><span className="custom-radio"></span></label>
                                    <label className="radio-label"><p>목요일</p><input type="radio" name="day" value="목요일" checked={dayoff === "목요일"} onClick={(e) => dayoffHandle(e.target.value)} /><span className="custom-radio"></span></label>
                                    <label className="radio-label"><p>금요일</p><input type="radio" name="day" value="금요일" checked={dayoff === "금요일"} onClick={(e) => dayoffHandle(e.target.value)} /><span className="custom-radio"></span></label>
                                </div>
                            </Dayoff>
                            <Credits>
                                <h1>학점 <span>(12 ~ 21)</span></h1>
                                <input value={credit} onChange={(e) => setCredit(e.currentTarget.value)} />
                            </Credits>
                            <Submit>
                                <button onClick={createRequest} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                                >{isHovered ? (<><img src={arrow} style={{ width: '1.2rem', height: '1.2rem' }} /></>) : (<>생성하기<img src={arrow} /></>)}
                                </button>
                            </Submit>
                        </FormRest>
                    </FormBlock>
            }
            {timeoffModal && (
                <>
                    <Overlay onClick={() => setTimeoffModal(false)} />
                    <Modal>
                        <p>날짜</p>
                        <ModalDay>
                            <label className="radio-label"><p>월요일</p><input type="radio" name="timeoff" value="월요일" onChange={(e) => updateDay(e.target.value)} /><span className="custom-radio"></span></label>
                            <label className="radio-label"><p>화요일</p><input type="radio" name="timeoff" value="화요일" onChange={(e) => updateDay(e.target.value)} /><span className="custom-radio"></span></label>
                            <label className="radio-label"><p>수요일</p><input type="radio" name="timeoff" value="수요일" onChange={(e) => updateDay(e.target.value)} /><span className="custom-radio"></span></label>
                            <label className="radio-label"><p>목요일</p><input type="radio" name="timeoff" value="목요일" onChange={(e) => updateDay(e.target.value)} /><span className="custom-radio"></span></label>
                            <label className="radio-label"><p>금요일</p><input type="radio" name="timeoff" value="금요일" onChange={(e) => updateDay(e.target.value)} /><span className="custom-radio"></span></label>
                        </ModalDay>
                        <p>시간</p>
                        <ModalTime>
                            <div>
                                <p>시작:</p>
                                <select id="startTime" value={timeState.startTime} onChange={(e) => updateStartTime(e.target.value)}>
                                    <option value="">선택하세요</option>
                                    {generateTimeOptions().map((time) => (
                                        <option value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            -
                            <div>
                                <p>종료:</p>
                                <select value={timeState.endTime} onChange={(e) => updateEndTime(e.target.value)}>
                                    <option value="">선택하세요</option>
                                    {generateTimeOptions().map((time) => (
                                        <option value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </ModalTime>
                        <button onClick={updateTimeoffArray}>확정하기</button>
                    </Modal>
                </>
            )}
        </FormBackground>
    )
}
export default CustomTimetable;
const Table = styled.div`
    display: grid;
    width: 88%;
    height: 100%;
    grid-template-columns:repeat(2, 1fr);
    grid-template-rows: repeat(5, 1fr); 
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
        height: 30%;
        font-size: 0.75rem;
        font-weight: 700;
        &.span{
            font-size: 0.8rem;
        }
        border-bottom: 1px solid #bebebe;
    }
    h2{
        height: 65%;
        font-weight: 400;
        font-size: 0.6rem;
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
`
const Modal = styled(FlexBox)`
    position: fixed;
    width: 50%;
    height: 50%;
    border-radius: 1rem;
    background-color: white;
    flex-direction: column;
    padding: 4%;
    gap: 4%;
    z-index: 20; /* 오버레이보다 위에 위치 */
    p{
        font-weight: 700;
        font-size: 0.8rem;
    }
    button{
        width: 15%;
        height: 10%;
        background-color: #f4f4f4;
        border: 1px solid #bebebe;
        border-radius: 0.25rem;
        font-weight: 700;
        font-size: 0.6rem;
        margin-top: 5%;
        margin-left: 85%;
        transition: transform 0.5s ease;
        &:hover{
            transform: translateY(-0.1rem);
            transform: scale(1.05);
        }
    }
`
const ModalTime = styled(FlexBox)`
    width: 100%;
    height: 40%;
    border: 1px solid #bebebe;
    border-radius: 0.5rem;
    gap: 7%;
    justify-content: center;
    align-items: center;
    div{
        width: 20%;
        height: 50%;
    }
    select{
        width: 90%;
        height:40%;
        border: 1px solid #bebebe;
        border-radius: 0.25rem;
        background-color: #f4f4f4;
        font-weight: 500;
        font-size: 0.6rem;
        cursor: pointer;
        padding-left: 5%;
    }
    :focus{
        outline: none;
    }
    p{
        font-weight: 500;
        font-size: 0.6rem;
        margin-left: 5%;
    }
`
const ModalDay = styled(FlexBox)`
    width: 100%;
    height: 20%;
    label{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12%;
            width: 20%;
            height: 100%;
            padding-right: 5%;
            p{
                font-size: 0.6rem;
                font-weight: 500;
            }
            input[type="radio"]{
                display: none;
            }
            .custom-radio{
                width: 0.7rem;
                height: 0.7rem;
                border: 1px solid #bebebe;
                background: #f4f4f4;
                cursor: pointer;
                transition: background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease;
                &:hover{
                    transform:translateY(-0.2rem);
                }
            }
            input[type="radio"]:checked + .custom-radio {
                transform: translateY(-0.1rem);
                transform: scale(1.1);
                box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.4);;
            }
            input[type="radio"]:checked + .custom-radio::after {
                content: ""; 
                position: absolute;
                width: 0.15rem; /* 체크 표시의 너비 */
                height: 0.375rem; /* 체크 표시의 높이 */
                border: solid black; 
                border-width: 0 0.09rem 0.09rem 0; /* 체크 표시 형태 */
                transform: rotate(45deg); /* 체크 표시 회전 */
                top: 40%; 
                left: 50%; 
                transform: translate(-50%, -50%) rotate(45deg); /* 중앙 정렬 및 회전 */
            }
        }
`
const FormBackground = styled(WidthBlock)`
    background-color: rgba(0,0,0,0.3);
    justify-content: center;
    cursor:default;
`
const FormBlock = styled(FlexBox)`
    width: 90%;
    height: 90%;
    gap: 2%;
    background-color: #FFF;
    border-radius: 1rem;
    padding: 2%;
    flex-direction: column;
    align-items:center;
    color: black;
    font-weight: 700;
`
const BackButton = styled(FlexBox)`
    width: 100%;
    height: 4%;
    justify-content: flex-end;
    img{
        width: 1rem;
        height: auto;
        cursor: pointer;
        transition: transform 0.5s ease;
        &:hover{
            transform: scale(1.2);
        }
    }
`
const CustomHeader = styled(FlexBox)`
    width: 92%;
    height: 6%;
    border-bottom: 2px solid #D2D2D2;
    align-items: center;
    h1{
        font-size: 1rem;
    }
    img{
        width: 1.5rem;
    }
    div{
        display: flex;
        width: 20%;
        gap: 5%;
        align-items: center;
    }
    button{
        width: 6%;
        height: 60%;
        background-color: #404040;
        border-radius: 0.25rem;
        font-size: 0.6rem;
        font-weight: 700;
        color: white;
        transition: transform 0.5s ease;
            &:hover{
            transform:translateY(-3px);
            }
    }
`
const FormHearder = styled(FlexBox)`
    width: 90%;
    height: 6%;
    align-items: center;
    justify-content: space-between;
    h1{
        font-size: 0.8rem;
    }
    h2{
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 2px;
        width: 10%;
        font-size: 0.7rem;
        cursor: pointer;
        transition: transform 0.5s ease;
        &:hover{
        transform: scale(1.1);
        transform:translateY(-5px);
        }
        img{
            height:1rem;
            width: auto;
        }
    }
`
const FormContainer = styled(FlexBox)`
    width: 90%;
    height: 26%;
    align-items: center;
    flex-direction: column;
    gap: 4%;
`
const FormContent = styled(FlexBox)`
    width: 100%;
    height: 22%;
    align-items: center;
    justify-content: space-between;
    h1{
        width: 5%;
        font-size: 0.8rem;
        display: flex;
        justify-content: center;
    }
    div{
        width: 90%;
        height: 90%;
        display: flex;
        border: 1px solid #bebebe;
        background: #f4f4f4;
        border-radius: 0.25rem;
        padding-left: 2%;
        padding-right: 1%;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: transform 0.5s ease;
        p{
            font-weight: 500;
            font-size: 0.6rem;
        }
        &:hover{
        transform: scale(1.1);
        transform:translateY(-5px);
        }
        img{
            height: 80%;
            width: auto;
            pointer-events: none;
        }
    }
    img{
        width: auto;
        height: 90%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.5s ease;
            &:hover{
            transform: scale(1.1);
            transform:translateY(-5px);
            }
    }
    &.wait{
        opacity: 0;
        pointer-events: none;
    }
`
const FormRest = styled(FlexBox)`
    width: 95%;
    height: 10%;
    margin-left: 5%;
    margin-top: 1%;
`
const Dayoff = styled(FlexBox)`
    width: 70%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    h1{
        width: 100%;
        height: 30%;
        font-size: 0.8rem;
    }
    div{
        width: 100%;
        height: 70%;
        padding-left: 5%;
        padding-right: 5%;
        display: flex;
        gap: 5%;
        label{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 20%;
            height: 100%;
            padding-right: 5%;
            p{
                font-size: 0.7rem;
                font-weight: 500;
            }
            input[type="radio"]{
                display: none;
            }
            .custom-radio{
                width: 1rem;
                height: 1rem;
                border: 1px solid #bebebe;
                background: #f4f4f4;
                cursor: pointer;
                transition: background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease;
                &:hover{
                    transform:translateY(-0.3rem);
                }
            }
            input[type="radio"]:checked + .custom-radio {
                transform: translateY(0.2rem);
                transform: scale(1.15);
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);;
            }
            input[type="radio"]:checked + .custom-radio::after {
                content: ""; 
                position: absolute;
                width: 0.2rem; /* 체크 표시의 너비 */
                height: 0.5rem; /* 체크 표시의 높이 */
                border: solid black; 
                border-width: 0 0.12rem 0.12rem 0; /* 체크 표시 형태 */
                transform: rotate(45deg); /* 체크 표시 회전 */
                top: 40%; 
                left: 50%; 
                transform: translate(-50%, -50%) rotate(45deg); /* 중앙 정렬 및 회전 */
            }
        }
    }
`
const Credits = styled(FlexBox)`
    width: 15%;
    height: 80%;
    flex-direction: column;
    justify-content: space-between;
    h1{
        font-size: 0.8rem;
    }
    span{
        font-size: 0.65rem;
    }
    input{
        width: 6rem;
        height: 1.2rem;
        font-size: 0.6rem;
        margin-left: 10%;
        font-weight: 500;
        text-align: center;
        border-radius: 0.25rem;
        border: 1px solid #BEBEBE;
        background: #F4F4F4;
        transition: box-shadow 0.5s ease;
        &:hover{
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4); /* 아래로 그림자 추가 */
        }
        &:focus{
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4); /* 아래로 그림자 추가 */
        }
    }
`
const Submit = styled(FlexBox)`
    width: 15%;
    height: 100%;
    justify-content: end;
    align-items: end;
    button{
        width: 8rem;
        height: 2rem;
        color: white;
        font-size: 0.7rem;
        border-radius: 0.5rem;
        background-color: #404040;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        transition: transform 0.5s ease, box-shadow 0.5s ease;
        img{
            width: 0.7rem;
            height: auto;
        }
        &:hover{
            transform: scale(1.05);
            box-shadow: 0px 5px 10px rgba(0,0,0,0.4);
        }
    }
`
