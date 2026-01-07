import logo from './logo.svg';
import './App.css';
import SkillTable from './SkillTable';
import {Container} from '@mui/material';
function App() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px'}}>
      <SkillTable/>
    </Container>
  );
}

export default App;
