import {BrowserRouter as Router , Switch , Route} from 'react-router-dom'
import { Userprovider } from './components/users/user-context';


import LoginRegister from './components/users/login-or-register'
import Navbar from './components/navbar/navbar';
import Profile from './components/Utilities/profile'
import Room from './components/Utilities/Room';
import AllInvites from './components/Utilities/Invites';
import Room_form from './components/Utilities/room-form';
import Test from './components/pdf-viewer/single-pdf-viewer';

function App() {

  return (
    <Router>
      <Userprovider>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path="/" component={LoginRegister}/>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/my_invites" component={AllInvites}/>
            <Route exact path="/create_room" component={Room_form}/>
            <Route exact path="/room/:room_id" component={Room}/>
            <Route exact path="/pdf" component={Test}/>
          </Switch>
        </div>
      </Userprovider>
    </Router>
  );
}

export default App;
