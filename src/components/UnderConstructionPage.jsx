import styled from "styled-components";
import AppointmentIncomingList from "./appointments/UserAppointment";

const UnderConstruction = () => {
  const ConstructionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `;
  return (
    
      // <ConstructionContainer>
      //   <h3>This page is still under construction.</h3>
      // </ConstructionContainer>
      <AppointmentIncomingList>
        
      </AppointmentIncomingList>
      
  );
};
export default UnderConstruction;
