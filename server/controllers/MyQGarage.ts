import MyQ from 'myq-api';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

enum GARAGEDOORSTATUS {
  OPEN,
  CLOSED,
}

type DeviceFamily = 'garagedoor' | 'light' | 'gateway';
type DeviceType = 'wifigdogateway' | 'wifigaragedooropener';

export interface MyQDevice {
  created_date: string;
  device_family: DeviceFamily;
  device_platform: string;
  device_type: DeviceType;
  href: string;
  name: string;
  parent_device: string;
  parent_device_id: string;
  serial_number: string;
}

interface MyQAPI {
  _accountId: null | string;
  _devices: MyQDevice[];
  _securityToken: null | string;
  _executeServiceRequest: () => Promise<any>;
  _getAccountId: () => Promise<any>;
  _getDeviceState: () => Promise<any>;
  _setDeviceState: () => Promise<any>;
  getDevice: () => Promise<any>;
  getDevices: () => Promise<any>;
  getDoorState: (serialNumber: string) => Promise<any>;
  getLightState: () => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  setDoorState: (
    serialNumber: string,
    status: 'OPEN' | 'CLOSE'
  ) => Promise<any>;
  setLightState: () => Promise<any>;
}

interface MyQGarageClass {
  email: string;
  password: string;
  myQ: any;
  login: () => Promise<void>;
  getGarageDoors: (
    singleGarage: boolean
  ) => Promise<MyQDevice | MyQDevice[] | undefined>;
  getGarageDoorStatus: (
    serialNumber: string
  ) => Promise<keyof typeof GARAGEDOORSTATUS | undefined>;
  changeGarageDoorStatus: (
    serialNumber: string,
    status: keyof typeof GARAGEDOORSTATUS
  ) => Promise<void>;
}
/**
 * Instanitiates a new MyQGarage class, exposing all class methods and members
 */
export default class MyQGarage implements MyQGarageClass {
  email: string;
  password: string;
  myQ: MyQAPI = new MyQ();

  constructor(email: string, password: string) {
    (this.email = email), (this.password = password);
  }
  /**
   * Logs in user and gets securityToken along with associated devices.
   * Devices get attached to myQ object.
   * @async
   */
  async login() {
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
  async getGarageDoors(singleGarage: boolean) {
    try {
      const garageDoor = this.myQ._devices?.filter(
        ({ device_family }) => device_family === 'garagedoor'
      );

      if (singleGarage) {
        return garageDoor[0];
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
  async getGarageDoorStatus(
    serialNumber: string
  ): Promise<keyof typeof GARAGEDOORSTATUS | undefined> {
    try {
      return await this.myQ?.getDoorState(serialNumber);
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }

  async changeGarageDoorStatus(
    serialNumber: string,
    status: keyof typeof GARAGEDOORSTATUS
  ) {
    try {
      await this.myQ?.setDoorState(
        serialNumber,
        status === 'OPEN' ? MyQ.actions.door.OPEN : MyQ.actions.door.CLOSE
      );
    } catch (error) {
      /**
       * TODO: Handle error properly
       */
      console.error(error);
    }
  }
}
