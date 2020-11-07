import MyQGarage, { MyQDevice} from './controllers/MyQGarage';

async function Server(){
const MyQ = new MyQGarage(
  process.env.MYQEMAIL ?? '',
  process.env.MYQPASSWORD ?? ''
);
await MyQ.login();
const garageDoor = await MyQ.getGarageDoors(true);
const garageDoorStatus = await MyQ.getGarageDoorStatus((garageDoor as MyQDevice)?.serial_number)
}

Server();
