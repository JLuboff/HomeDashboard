import MyQ from 'myq-api';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MyQGarage = async () => {
  const myQ = new MyQ();
  const getToken = async (): Promise<void> => {
    try {
      await myQ.login(process.env.MYQEMAIL, process.env.MYQPASSWORD);
    } catch (error) {
      console.error(error);
    }
  };

  async function connected() {
    try {
      await getToken();

      const deviceList = await myQ?.getDevices();
      const garageDoor = deviceList?.devices?.filter(
        ({ device_family }) => device_family === 'garagedoor'
      )[0];
      const garageDoorSerialNumber = garageDoor.serial_number;
      const garageDoorStatus = await  myQ?.getDoorState(garageDoorSerialNumber);

      if (garageDoorStatus.deviceState === 'closed') {
        console.log(MyQ.actions)
        await myQ?.setDoorState(garageDoorSerialNumber, MyQ.actions.door.OPEN)
      }
      if (garageDoorStatus.deviceState === 'open'){
        await myQ?.setDoorState(garageDoorSerialNumber, MyQ.actions.door.CLOSE)
      }
    } catch (error) {
      console.error(error);
    }
  }

  connected();
};

export default MyQGarage;
