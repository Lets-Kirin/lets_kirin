import { useLocation, useNavigate } from "react-router-dom";
import { WidthBlock, Wrapper, FlexBox } from "../styles/styled";
import styled from "styled-components";
import runkirin from "../images/runningkirin.png";
import search from "../images/Search.svg";
import { useEffect, useState } from "react";
import { apiGetCourse } from "../apis";
import useLogin from "../hooks/useLogin";

function SelectCourse() {
    useLogin();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchCourse, setSearchCourse] = useState('');
    const [loading, setLoading] = useState(false);
    const [getCourseArray, setGetCourseArray] = useState([]);
    const [stateNavigate, setStateNavigate] = useState(false);
    const [selectCourse, setSelectCourse] = useState();
    const [courseList, setCourseList] = useState([]);
    const confirmCourse = () => {
        if (selectCourse !== undefined) {
            setGetCourseArray(location.state.item.map((item, i) =>
                i === location.state.idx ? selectCourse : item));
        }
        else {
            setGetCourseArray(location.state.item);
        }
        setStateNavigate(true);
    };
    const fetchSearch = () => {
        setLoading(true);
        apiGetCourse(searchCourse)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCourseList(response.data);
                    setSelectCourse();
                    setLoading(false);
                } else {
                    console.error("Expected an array but got:", response.data);
                    setCourseList([]); // 빈 배열로 설정
                    setSelectCourse();
                    setLoading(false);
                }
            })
            .catch(error => {
                alert(error);
                setSelectCourse();
                setLoading(false);
            })
    }
    useEffect(() => {
        if (stateNavigate) {
            navigate('/custom', {
                state: {
                    item: getCourseArray,
                    timeoff: location.state.timeoff,
                    credit: location.state.credit,
                    dayoff: location.state.dayoff
                }
            });
            setStateNavigate(false);
        }
    }, [stateNavigate]);
    return (
        <CourseBackground>
            <CourseBlock>
                <CourseHeader>
                    교과목명 검색
                </CourseHeader>
                <InputWrapper>
                    <InputLeftImg src={runkirin} />
                    <CourseInput
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter')
                                return fetchSearch();
                        }
                        }
                    />
                    <InputRightImg src={search} onClick={fetchSearch} />
                </InputWrapper>
                <Line />
                <SearchCourseBlock>
                    {loading ? <LoadingBlock>Loading...</LoadingBlock> :
                        <Table cellnum={courseList.length}>
                            <Header>
                                <HeaderCell>개설학과</HeaderCell>
                                <HeaderCell>학수번호</HeaderCell>
                                <HeaderCell>분반</HeaderCell>
                                <HeaderCell>교과목명</HeaderCell>
                                <HeaderCell>이수구분</HeaderCell>
                                <HeaderCell>학점</HeaderCell>
                                <HeaderCell>교수명</HeaderCell>
                                <HeaderCell>요일 및 강의시간</HeaderCell>
                                <HeaderCell>강의실</HeaderCell>
                                <HeaderCell>선택</HeaderCell>
                            </Header>
                            {courseList.map((item, index) => (
                                <Row key={index}>
                                    <Cell>{item.department_major}</Cell>
                                    <Cell>{item.courseNumber}</Cell>
                                    <Cell>{item.sectionNumber}</Cell>
                                    <Cell>{item.courseName}</Cell>
                                    <Cell>{item.courseClassification}</Cell>
                                    <Cell>{item.credits}</Cell>
                                    <Cell>{item.professorName}</Cell>
                                    <Cell>{item.courseDay} {item.courseTime}</Cell>
                                    <Cell>{item.classroom}</Cell>
                                    <Cell>
                                        <input type="radio" name="course" onChange={() => setSelectCourse(item)} />
                                    </Cell>
                                </Row>
                            ))}
                        </Table>}
                </SearchCourseBlock>
                <ConfirmButtonBlock>
                    <button onClick={confirmCourse}>
                        등록하기
                    </button>
                </ConfirmButtonBlock>
            </CourseBlock>
        </CourseBackground>
    )
}
export default SelectCourse;
const LoadingBlock = styled(FlexBox)`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
`
const CourseBackground = styled(WidthBlock)`
    background-color: rgba(0,0,0,0.3);
    justify-content: center;
    cursor:default;
`
const CourseBlock = styled(FlexBox)`
    width: 90%;
    height: 90%;
    gap: 1%;
    background-color: #FFF;
    border-radius: 1rem;
    padding: 3%;
    padding-bottom: 0;
    flex-direction: column;
    align-items: center;
    color: black;
    font-weight: 700;
`
const CourseHeader = styled(FlexBox)`
    width: 100%;
    height: 5%;
    font-size: 1rem;
`
const InputWrapper = styled(FlexBox)`
    width: 95%;
    height: 5.5%;
    position: relative;
`
const InputLeftImg = styled.img`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    height: auto;
`
const InputRightImg = styled.img`
    position: absolute;
    cursor: pointer;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: auto;
    transition: transform 0.5s ease;
`
const CourseInput = styled.input`
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid #bebebe;
    border-radius: 0.25rem;
    background-color: #f4f4f4;
    padding-left:6%;
    font-size: 0.65rem;
    font-weight: 600;
`
const Line = styled(FlexBox)`
    width: 100%;
    height: 2%;
    border-bottom: 2px solid #bebebe;
`
const SearchCourseBlock = styled(FlexBox)`
    width: 100%;
    height: 72%;
    border: 0.5px solid black;
    margin-top: 1%;
    overflow-y: auto;
    overscroll-behavior: none; /* 스크롤이 전체화면으로 넘어가는거 방지 */
`
const Table = styled.div`
    display: grid;
    width: 100%;
    //3 2 1 4 1 1 1 2 2 1
    grid-template-columns: 4fr 1fr 1fr 4fr 1fr 1fr 2fr 2fr 2fr 1fr;
    grid-template-rows: repeat(${(props) => props.cellnum + 1}, 1.2rem);
    max-height: 100%; 
    font-size: 0.6rem;
    overflow-y: auto;
`;

const Header = styled.div`
    display: contents; /* 그리드 레이아웃을 유지하기 위해 사용 */
`;

const HeaderCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #D9D9D9;
    font-size: 0.6rem;
    font-weight: 700;
    border-right: 0.5px solid black;
    border-bottom: 0.5px solid black;
    &:last-of-type{
        border-right:0px;
    }
`;

const Row = styled.div`
    display: contents; /* 그리드 레이아웃을 유지하기 위해 사용 */
`;
const Cell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.55rem;
    font-weight: 400;
    white-space: nowrap; /* 텍스트가 한 줄로 유지 */
    text-overflow: ellipsis; /* 넘칠 경우 ... 표시 */
    border-right: 0.5px solid black;
    border-bottom: 0.5px solid black;
    overflow: hidden;
    &:last-of-type{
        border-right:0px;
    }
`;
const ConfirmButtonBlock = styled(FlexBox)`
    width: 100%;
    height: 5%;
    justify-content: end;
    align-items: center;
    button {
    display: inline-block;
    border-radius: 0.25rem; 
    background-color: #404040;
    border: none;
    color: #FFFFFF;
    text-align: center;
    width: 8%; 
    height: 90%;
    font-size: 0.6rem;
    transition: all 0.5s;
    cursor: pointer;
    &:hover{
        transform: translateY(-3px);
    }
    }
`;

