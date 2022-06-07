import { io } from "socket.io-client";
import { exec }  from "child_process";
const platform = process.platform
let cmd = ""
let osExec;
let serialNumber=""

const errorCheck =(error,stderr)=>{
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
}

if (platform === "linux") {
        cmd = "dmidecode -s system-serial-number"
        osExec = (error, stdout, stderr) => {
            errorCheck(error,stderr);
            serialNumber = stdout;
            agentRun(serialNumber);
        };

}

if (platform === "win32") {
        cmd = 'wmic csproduct get IdentifyingNumber';
        osExec = (error, stdout, stderr) => {
            errorCheck(error,stderr);
            serialNumber = stdout.split('\n')[1].trim();
            agentRun(serialNumber);
        };

}

if (process.platform === 'darwin') {
    cmd = 'ioreg -l | grep IOPlatformSerialNumber';
    osExec = (error, stdout, stderr) => {
        errorCheck(error,stderr);
        serialNumber = stdout.split('\n')[1].split('"')[3];
        agentRun(serialNumber);
      }

}

const socket = io("http://localhost:3000/"); 

socket.on("Socket-messages", (message) => {
    console.log("hi");
  });


  const sendMessage = (message) => {
      console.log(message);
    socket.emit("Socket-messages",message)
  };

  
  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  exec(cmd , osExec);
  const agentRun = async (serialNumber)=>{
      
      
      while(true){

        await sleep(5000);

        sendMessage("Ready");
        
        await sleep(5000);
              
        sendMessage(serialNumber);
          
        }
}

