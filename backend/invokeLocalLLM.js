const { spawn } = require('child_process');
const interpreterPath = 'C:\\tools\\Anaconda3\\python.exe'
const scriptPath = 'C:\\ArthurWorkSpace\\LangChainForNote\\py_main_chain.py';
const _ = require("lodash");

const invokeLocalLLM = (prompt, callback) => {
        const pythonProcess = spawn(interpreterPath, [scriptPath, "\"" + _.escape(prompt) + "\""]);

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.log(`Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                callback(result);
                console.log("[Invoke] Process exited successfully. the result is: " + result);
            } else {
                console.log(`Process exited with code ${code}`);
            }
        });
}

module.exports = {invokeLocalLLM}