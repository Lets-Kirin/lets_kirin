
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
    *{
        box-sizing: border-box;
    }
    a{
        text-decoration: none;
        color: inherit;
    }
    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table{
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 1.4vw;
        vertical-align: baseline;
        font-family: 'Pretendard', sans-serif;
        font-style: normal;
        line-height: normal;    
    }
    ::placeholder{
        font-size: 0.6rem;
        vertical-align: baseline;
        font-weight:700;
        font-family: 'Pretendard', sans-serif;
        color:#404040;
        font-style: normal;
        line-height: normal;   
    }
    input:focus{
        outline: none;
    }
    hr{
        margin:0;
    }
    ::-webkit-scrollbar{
        width: 0px;
    }
    body{
        line-height: 1;
        font-family: 'Pretendard', sans-serif;
        font-style: normal;
        line-height: normal;
        overscroll-behavior: none; //스크롤 체이닝 방지
        overflow-x: hidden;
    }
    ol, ul{
        list-style: none;
    }
    button {
        border: 0;
        background: transparent;
        cursor: pointer;
    }
`;

export default GlobalStyles;
