import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { MembersList } from './components';
import Container from '@mui/material/Container';
import CreateMember from './components/create-member/createMember';

export const Root = styled.main`
  height: 100vh;
  width: 100%;
`;

const App = () => (
  <Root>
    <BrowserRouter>
      <Container maxWidth='md'>
        <Routes>
          <Route path='/' exact element={<MembersList />} />
          <Route path='/member' exact element={<CreateMember  />} />
          <Route path='/edit-member' exact element={<CreateMember isEditing={true}/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  </Root>
);

export default App;
