import React from 'react';
import styled from 'styled-components';

const LoadingComponent = () => {
    return (
        <StyledWrapper>
            <div className="wrapper">
                <div className="circle" />
                <div className="circle" />
                <div className="circle" />
                <div className="shadow" />
                <div className="shadow" />
                <div className="shadow" />
            </div>
            <div className="spinner">
                <span>L</span>
                <span>O</span>
                <span>A</span>
                <span>D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 텍스트를 중앙 정렬 */
  height: 100%; /* 전체 높이 사용 */
  justify-content: center; /* 수직 중앙 정렬 */

  .wrapper {
    width: 12.5rem; /* 200px */
    height: 3.75rem; /* 60px */
    position: relative;
    z-index: 1;
  }

  .circle {
    width: 1.25rem; /* 20px */
    height: 1.25rem; /* 20px */
    position: absolute;
    border-radius: 50%;
    background-color: #f4f4f4;
    left: 15%;
    transform-origin: 50%;
    border: 0.1px solid black;
    animation: circle7124 .5s alternate infinite ease;
  }

  @keyframes circle7124 {
    0% {
      top: 3.75rem; /* 60px */
      height: 0.3125rem; /* 5px */
      border-radius: 50px 50px 25px 25px; /* 이 값은 rem으로 변환하지 않음 */
      transform: scaleX(1.7);
    }

    40% {
      height: 1.25rem; /* 20px */
      border-radius: 50%;
      transform: scaleX(1);
    }

    100% {
      top: 0%;
    }
  }

  .circle:nth-child(2) {
    left: 45%;
    animation-delay: .2s;
  }

  .circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }

  .shadow {
    width: 1.25rem; /* 20px */
    height: 0.25rem; /* 4px */
    border-radius: 50%;
    background-color: rgba(0,0,0,0.9);
    position: absolute;
    top: 3.875rem; /* 62px */
    transform-origin: 50%;
    z-index: -1;
    left: 15%;
    filter: blur(0.0625rem); /* 1px */
    animation: shadow046 .5s alternate infinite ease;
  }

  @keyframes shadow046 {
    0% {
      transform: scaleX(1.5);
    }

    40% {
      transform: scaleX(1);
      opacity: .7;
    }

    100% {
      transform: scaleX(0.125); /* 2px */
      opacity: .4;
    }
  }

  .shadow:nth-child(4) {
    left: 45%;
    animation-delay: .2s;
  }

  .shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: .3s;
  }

  .spinner {
    margin-top: 1.5rem;
    margin-left: 1.5rem;
   height: 3.125rem;
   width: max-content;
   font-size: 1.125rem;
   font-weight: 600;
   font-family: sans-serif;
   letter-spacing: 1em;
   color: black;
   display: flex;
   justify-content: center;
   align-items: center;
  }

  .spinner span {
   animation: loading6454 1.75s ease infinite;
  }

  .spinner span:nth-child(2) {
   animation-delay: 0.25s;
  }

  .spinner span:nth-child(3) {
   animation-delay: 0.5s;
  }

  .spinner span:nth-child(4) {
   animation-delay: 0.75s;
  }

  .spinner span:nth-child(5) {
   animation-delay: 1s;
  }

  .spinner span:nth-child(6) {
   animation-delay: 1.25s;
  }

  .spinner span:nth-child(7) {
   animation-delay: 1.5s;
  }

  @keyframes loading6454 {
   0%, 100% {
    transform: translateY(0);
   }

   50% {
    transform: translateY(-0.625rem);
   }
}
`;

export default LoadingComponent;
