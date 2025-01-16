import styled from "styled-components";

const UnderConstruction = () => {
  const ConstructionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `;
  return (
    
      <ConstructionContainer>
        <h3>This page is still under construction, Planned release Q1 2025.</h3>
      </ConstructionContainer>
       
  );
};
export default UnderConstruction;
