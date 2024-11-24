import styled from "styled-components";

export const FlexBox = styled.div`
display:flex;
flex-shrink: 0;
`;
export const GridBox = styled.div`
display: grid;
`

export const Wrapper = styled(FlexBox)`
position:relative;

flex-direction:column;
justify-content:flex-start;
align-items:center;
`;

export const WidthBlock = styled(FlexBox)`
position:relative;
width:100vw;
height:100vh;

//overflow-y:auto;
//background-color:#FFF;

flex-direction:column;
justify-content:flex-start;
align-items:center;
`;