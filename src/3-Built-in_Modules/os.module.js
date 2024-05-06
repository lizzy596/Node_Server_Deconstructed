const os = require('os');




const osModule = () => {

// Get the operating system's platform
console.log('Platform:', os.platform());

// Get the operating system's architecture
console.log('Architecture:', os.arch());

// Get the number of CPU cores
console.log('Number of CPU cores:', os.cpus().length);

// Get the total amount of system memory (in bytes)
console.log('Total memory:', `${os.totalmem()} bytes`);

// Get the home directory of the current user
console.log('Home directory:', os.homedir());

// Get the hostname of the system
console.log('Hostname:', os.hostname());

// Get the operating system's release
console.log('OS release:', os.release());
};

osModule();