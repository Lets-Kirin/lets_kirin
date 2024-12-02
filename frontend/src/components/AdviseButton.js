import React from 'react';
import styled from 'styled-components';

function AdviseButton({ onClick }) {
    return (
        <StyledWrapper onClick={onClick}>
            <button className="continue-application">
                <div>
                    <div className="pencil" />
                    <div className="folder">
                        <div className="top">
                            <svg viewBox="0 0 24 27">
                                <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z" />
                            </svg>
                        </div>
                        <div className="paper" />
                    </div>
                </div>
                기이수 분석
            </button>
        </StyledWrapper>
    );
};
export default AdviseButton;
const StyledWrapper = styled.div`
  .continue-application {
    --color: #fff;
    --background: #404660;
    --background-hover: #3A4059;
    --background-left: #2B3044;
    --folder: #F3E9CB;
    --folder-inner: #BEB393;
    --paper: #FFFFFF;
    --paper-lines: #BBC1E1;
    --paper-behind: #E1E6F9;
    --pencil-cap: #fff;
    --pencil-top: #275EFE;
    --pencil-middle: #fff;
    --pencil-bottom: #5C86FF;
    --shadow: rgba(13, 15, 25, .2);
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    border-radius: 0.234375rem; /* 0.3125rem * 0.75 */
    font-size: 0.6rem; /* 0.875rem * 0.75 */
    font-weight: 500;
    line-height: 0.890625rem; /* 1.1875rem * 0.75 */
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    padding: 0.796875rem 1.359375rem 0.796875rem 3.234375rem; /* 1.0625rem, 1.8125rem, 1.0625rem, 4.3125rem */
    transition: background 0.3s;
    color: var(--color);
    background: var(--bg, var(--background));
  }

  .continue-application > div {
    top: 0;
    left: 0;
    bottom: 0;
    width: 2.484375rem; /* 3.3125rem * 0.75 */
    position: absolute;
    overflow: hidden;
    border-radius: 0.234375rem 0 0 0.234375rem; /* 0.3125rem * 0.75 */
    background: var(--background-left);
  }

  .continue-application > div .folder {
    width: 1.078125rem; /* 1.4375rem * 0.75 */
    height: 1.265625rem; /* 1.6875rem * 0.75 */
    position: absolute;
    left: 0.703125rem; /* 0.9375rem * 0.75 */
    top: 0.609375rem; /* 0.8125rem * 0.75 */
  }

  .continue-application > div .folder .top {
    left: 0;
    top: 0;
    z-index: 2;
    position: absolute;
    transform: translateX(var(--fx, 0));
    transition: transform 0.4s ease var(--fd, 0.3s);
  }

  .continue-application > div .folder .top svg {
    width: 1.125rem; /* 1.5rem * 0.75 */
    height: 1.265625rem; /* 1.6875rem * 0.75 */
    display: block;
    fill: var(--folder);
    transform-origin: 0 50%;
    transition: transform 0.3s ease var(--fds, 0.45s);
    transform: perspective(5.625rem) rotateY(var(--fr, 0deg)); /* 7.5rem * 0.75 */
  }

  .continue-application > div .folder:before, .continue-application > div .folder:after,
  .continue-application > div .folder .paper {
    content: "";
    position: absolute;
    left: var(--l, 0);
    top: var(--t, 0);
    width: var(--w, 100%);
    height: var(--h, 100%);
    border-radius: 0.046875rem; /* 0.0625rem * 0.75 */
    background: var(--b, var(--folder-inner));
  }

  .continue-application > div .folder:before {
    box-shadow: 0 0.0703125rem 0.140625rem var(--shadow), 0 0.1171875rem 0.234375rem var(--shadow), 0 0.1640625rem 0.328125rem var(--shadow); /* 0.09375rem, 0.15625rem, 0.21875rem */
    transform: translateX(var(--fx, 0));
    transition: transform 0.4s ease var(--fd, 0.3s);
  }

  .continue-application > div .folder:after,
  .continue-application > div .folder .paper {
    --l: 0.046875rem; /* 0.0625rem * 0.75 */
    --t: 0.046875rem; /* 0.0625rem * 0.75 */
    --w: 0.984375rem; /* 1.3125rem * 0.75 */
    --h: 1.171875rem; /* 1.5625rem * 0.75 */
    --b: var(--paper-behind);
  }

  .continue-application > div .folder:after {
    transform: translate(var(--pbx, 0), var(--pby, 0));
    transition: transform 0.4s ease var(--pbd, 0s);
  }

  .continue-application > div .folder .paper {
    z-index: 1;
    --b: var(--paper);
  }

  .continue-application > div .folder .paper:before, .continue-application > div .folder .paper:after {
    content: "";
    width: var(--wp, 0.65625rem); /* 0.875rem * 0.75 */
    height: 0.09375rem; /* 0.125rem * 0.75 */
    border-radius: 0.046875rem; /* 0.0625rem * 0.75 */
    transform: scaleY(0.5);
    left: 0.140625rem; /* 0.1875rem * 0.75 */
    top: var(--tp, 0.140625rem); /* 0.1875rem * 0.75 */
    position: absolute;
    background: var(--paper-lines);
    box-shadow: 0 0.5625rem 0 0 var(--paper-lines), 0 1.125rem 0 0 var(--paper-lines); /* 0.75rem, 1.5rem */
  }

  .continue-application > div .folder .paper:after {
    --tp: 0.28125rem; /* 0.375rem * 0.75 */
    --wp: 0.46875rem; /* 0.625rem * 0.75 */
  }

  .continue-application > div .pencil {
    height: 0.09375rem; /* 0.125rem * 0.75 */
    width: 0.140625rem; /* 0.1875rem * 0.75 */
    border-radius: 0.046875rem 0.046875rem 0 0; /* 0.0625rem * 0.75 */
    top: 0.375rem; /* 0.5rem * 0.75 */
    left: 105%;/* 6.5625rem * 0.75 */
    position: absolute;
    z-index: 3;
    transform-origin: 50% 0.890625rem; /* 1.1875rem * 0.75 */
    background: var(--pencil-cap);
    transform: translateX(var(--pex, 0)) rotate(35deg);
    transition: transform 0.4s ease var(--pbd, 0s);
  }

  .continue-application > div .pencil:before, .continue-application > div .pencil:after {
  content: "";
  position: absolute;
  display: block;
  background: var(--b, linear-gradient(var(--pencil-top) 55%, var(--pencil-middle) 55.1%, var(--pencil-middle) 60%, var(--pencil-bottom) 60.1%));
  width: var(--w, 0.234375rem); /* 0.3125rem * 0.75 */
  height: var(--h, 0.9375rem); /* 1.25rem * 0.75 */
  border-radius: var(--br, 0.09375rem 0.09375rem 0 0); /* 0.125rem * 0.75 */
  top: var(--t, 0.09375rem); /* 0.125rem * 0.75 */
  left: var(--l, -0.046875rem); /* -0.0625rem * 0.75 */
}

.continue-application > div .pencil:before {
  -webkit-clip-path: polygon(0 5%, 0.234375rem 5%, 0.234375rem 0.796875rem, 50% 0.9375rem, 0 0.796875rem); /* 0.3125rem * 0.75, 1.0625rem * 0.75, 1.25rem * 0.75 */
  clip-path: polygon(0 5%, 0.234375rem 5%, 0.234375rem 0.796875rem, 50% 0.9375rem, 0 0.796875rem);
}

.continue-application > div .pencil:after {
  --b: none;
  --w: 0.140625rem; /* 0.1875rem * 0.75 */
  --h: 0.28125rem; /* 0.375rem * 0.75 */
  --br: 0 0.09375rem 0.046875rem 0; /* 0.125rem * 0.75 */
  --t: 0.140625rem; /* 0.1875rem * 0.75 */
  --l: 0.140625rem; /* 0.1875rem * 0.75 */
  border-top: 0.046875rem solid var(--pencil-top); /* 0.0625rem * 0.75 */
  border-right: 0.046875rem solid var(--pencil-top); /* 0.0625rem * 0.75 */
}

.continue-application:before, .continue-application:after {
  content: "";
  position: absolute;
  width: 0.46875rem; /* 0.625rem * 0.75 */
  height: 0.09375rem; /* 0.125rem * 0.75 */
  border-radius: 0.046875rem; /* 0.0625rem * 0.75 */
  background: var(--color);
  transform-origin: 0.421875rem 0.046875rem; /* 0.5625rem * 0.75, 0.0625rem * 0.75 */
  transform: translateX(var(--cx, 0)) scale(0.5) rotate(var(--r, -45deg));
  top: 1.21875rem; /* 1.625rem * 0.75 */
  right: 0.75rem; /* 1rem * 0.75 */
  transition: transform 0.3s;
}

.continue-application:after {
  --r: 45deg; /* 45deg * 0.75 */
}

.continue-application:hover {
  --cx: 0.09375rem; /* 0.125rem * 0.75 */
  --bg: var(--background-hover);
  --fx: -1.875rem; /* -2.5rem * 0.75 */
  --fr: -60deg; /* -60deg * 0.75 */
  --fd: 0.1125s; /* 0.15s * 0.75 */
  --fds: 0s;
  --pbx: 0.140625rem; /* 0.1875rem * 0.75 */
  --pby: -0.140625rem; /* -0.1875rem * 0.75 */
  —pbd: 0.1125s; /* 0.15s * 0.75 */
  —pex: -1.125rem; /* -1.5rem * 0.75 */
}
`
