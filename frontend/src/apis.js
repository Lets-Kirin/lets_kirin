import axios from 'axios';
// api를 정의하는 코드 파일 
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACK_API,
    //baseURL: "http://localhost:8000", // 배포시 변경 에정
    //withCredentials: true,
})
// Axios 라이브러리를 사용하여 HTTP 클라이언트 인스턴스를 생성하는 부분
export const apiAdvise = (token) => instance.get('/user/skill-advise', {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const apiLogin = (loginInfo) => instance.post('/auth/signIn', loginInfo);
export const apiSignUp = (signUpInfo) => instance.post('/auth/signUp', signUpInfo);
export const apiGetTimeTable = (token) => instance.get('/recommended-timetable', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
export const apiRecommendTimetable = (token, body) => instance.post('/recommended-timetable', body, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const apiGetMyPage = (token) => instance.get('/user/mypage', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
export const apiGetCourse = (search) => instance.get('/course/search', {
    params: {
        query: search
    }
});
export const apiUploadFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file); // 'file'은 서버가 기대하는 필드 이름

    try {
        const response = await instance.post('/taken-course/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Content-Type 설정
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error); // 에러 응답 데이터 로그
        //window.location.reload();
        throw error; // 에러 발생 시 다시 던짐
    }
};