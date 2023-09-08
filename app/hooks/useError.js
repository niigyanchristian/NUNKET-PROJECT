import io from 'socket.io-client';
import socketApi from '../config/socketApi';


export default useError = () => {
  
  const send = async (Location,ErrorMeassage) => {
    const socketing = io(socketApi.socketApi);
        socketing.emit("errors", {method:"GET",body:{Location,ErrorMeassage}});
 };


  return { send };
};
