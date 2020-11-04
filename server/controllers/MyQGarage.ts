import MyQ from 'myq-api';
import path from 'path';

const MyQGarage = async () => {
const myQ = new MyQ();
const getToken = async () => {
    try {
        const result = await myQ.login(process.env.MYQEMAIL, process.env.MYQPASSWORD);

        return result
    } catch (error) {
        console.error(error)
    }
} 

async function connected(){
    try {
        const token = await getToken();
        const deviceList = await token.getDevices();
    } catch (error) {
        console.error(error)
    }
}

connected();
}

export default MyQGarage;
