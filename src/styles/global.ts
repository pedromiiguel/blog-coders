import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin:0;
    padding:0;
    outline:none;
    box-sizing:border-box;
  }

  html, body, #root { 
    height:100%; 
    width:100%;
    font-family: sans-serif;
  }

  #app {
    display: flex;
    justify-content: center;
  }
`;
