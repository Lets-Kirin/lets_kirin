import styled from "styled-components";
import { FlexBox, WidthBlock, Wrapper } from "../styles/styled";
import gradeDownload from "../images/gradeDownload.png";
import firstPage from "../images/firstPage.png";
import mypageUpload from "../images/mypageUpload.png";
import advise from "../images/advise.png";
import customTime from "../images/customTime.png";
import checkTime from "../images/checkTime.png";
function Instruction() {
  return (
    <WidthBlock style={{ height: "150vh", alignItems: "center", gap: "3%" }}>
      <InstructionHeader>사용법</InstructionHeader>
      <InstructContainer>
        <InstuctBlock>
          <InstructImg src={gradeDownload} />
          <InstructText>
            <h1><span>1. </span>기이수 성적 다운받기</h1>
            <p><span>⚀</span>  교내 학사 정보 시스템(수강신청 사이트) 접속<br />
              <span>⚁</span>  수업/성적 - 성적 및 강의 평가 - 기이수 성적 조회<br />
              <span>⚂</span>  조회 이후, 사진과 같이 다운로드 클릭
            </p>
          </InstructText>
        </InstuctBlock>
        <InstuctBlock>
          <InstructImg src={firstPage} style={{ width: "auto", height: "35%" }} />
          <InstructText style={{ height: "50%" }}>
            <h1><span>2. </span>성적 입력하기</h1>
            <p><span>⚀</span>  회원가입 이후, 로그인 하여 사이트 접속하기<br />
              <span>⚁</span>  기이수 미 입력시, 사진과 같은 화면이 나타남<br />
              <span>⚂</span> 파일 추가 버튼을 클릭하여 기이수 엑셀 파일 입력
            </p>
          </InstructText>
        </InstuctBlock>
        <InstuctBlock>
          <InstructImg src={mypageUpload} style={{ width: "auto", height: "40%" }} />
          <InstructText style={{ height: "50%" }}>
            <h1><span>3. </span>성적 업데이트하기</h1>
            <p><span>⚀</span>  상단 바에서 마이페이지 클릭<br />
              <span>⚁</span>  기이수 과목 정보란 옆에서 Update 누르기 <br />
              <span>⚂</span> 이후, 기이수 엑셀 파일 입력
            </p>
          </InstructText>
        </InstuctBlock>
      </InstructContainer>
      <InstructContainer>
        <InstuctBlock>
          <InstructImg src={advise} style={{ width: "auto", height: "50%" }} />
          <InstructText style={{ height: "40%" }}>
            <h1><span>4. </span>기이수 분석하기</h1>
            <p><span>⚀</span>  파일 업로드 이후, 마이페이지로 이동<br />
              <span>⚁</span> 기이수 분석 버튼을 통해 자신의 수업 역량 분석<br />
            </p>
          </InstructText>
        </InstuctBlock>
        <InstuctBlock>
          <InstructImg src={customTime} style={{ width: "auto", height: "40%" }} />
          <InstructText style={{ height: "40%" }}>
            <h1><span>5. </span>시간표 커스텀하기</h1>
            <p><span>⚀</span>  상단 바를 통해 시간표 페이지로 이동<br />
              <span>⚁</span>  화면처럼 수업과 공강을 커스텀하고 생성하기<br />
            </p>
          </InstructText>
        </InstuctBlock>
        <InstuctBlock>
          <InstructImg src={checkTime} style={{ width: "auto", height: "40%" }} />
          <InstructText style={{ height: "40%" }}>
            <h1><span>6. </span>시간표 참고하기</h1>
            <p><span>⚀</span>  커스텀 한 시간표 확인이 끝나고 나면,<br />
              <span>⚁</span>   시간표 화면에서 시각적으로 표현된 시간표 확인하기<br />
            </p>
          </InstructText>
        </InstuctBlock>
      </InstructContainer>
    </WidthBlock>
  )
}
const InstructionHeader = styled(FlexBox)`
  width: 26%;
  height: 5%;
  justify-content: center;
  align-items: center;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  font-size: 1.2rem;
  font-weight: bold;
`
const InstructContainer = styled(FlexBox)`
  width: 90%;
  height: 45%;
  justify-content: space-between;
`
const InstuctBlock = styled(FlexBox)`
  width: 30%;
  height: 90%;
  border: 1.5px solid #bebebe;
  border-radius: 1rem;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  gap: 5%;
`
const InstructImg = styled.img`
  width: 95%;
  height: auto;
`
const InstructText = styled(FlexBox)`
  padding: 3%;
  width: 90%;
  height: 65%;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: black;
  gap: 10%;
  h1{
    font-size: 0.8rem;
    font-weight: bold;
    span{
      font-size: 0.9rem;
    }
  }
  p{
    font-size: 0.65rem;
    font-weight: 400;
    span{
      font-size: 1.5rem;
    }
  }
`
export default Instruction;