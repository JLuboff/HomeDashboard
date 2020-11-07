import MyQ from 'myq-api';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

enum GARAGEDOORSTATUS {
  OPEN,
  CLOSED
}

class MyQGarageClass {
  email: string;
  password: string;
  myQ: any = new MyQ()

  constructor(email: string, password: string){
    this.email = email,
    this.password = password
  }
/**
 * Logs in user and gets securityToken along with associated devices.
 * Devices get attached to myQ object.
 * @async
 */
  async login(){
    try {
      await this.myQ.login(this.email, this.password);
      await this.myQ.getDevices();
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }
/**
 * Returns single garage object if singleGarage is true else returns an array of garage objects
 * @async
 * @param singleGarage 
 * boolean
 */
  async getGarageDoors(singleGarage: boolean){
    try {
      const garageDoor = this.myQ.deviceList?.devices?.filter(
        ({ device_family }) => device_family === 'garagedoor'
      )

      if (singleGarage){
        return garageDoor[0]
      }

      return garageDoor;
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }
/**
 * Returns the current garage door status (open or closed)
 * @async
 * @param serialNumber 
 * string
 */
  async getGarageDoorStatus(serialNumber: string): Promise<keyof typeof GARAGEDOORSTATUS | undefined> {
    try {
      return await this.myQ?.getDoorState(serialNumber);
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }
  
  async changeGarageDoorStatus(serialNumber: string, status: keyof typeof GARAGEDOORSTATUS){
    try {
        await this.myQ?.setDoorState(serialNumber, status === 'OPEN' ? MyQ.actions.door.OPEN : MyQ.actions.door.CLOSE);
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }
}

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
