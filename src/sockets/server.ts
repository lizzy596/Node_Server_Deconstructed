import * as net from 'net';
 import { authHandshake } from './utils';

let isAuthenticated = false;

const server = net.createServer((socket: net.Socket) => {
    console.log('Client connected');
   
    socket.on('data', async (data: Buffer) => {
   
        if(!isAuthenticated) {
            try {
                const authStatus =  authHandshake(data.toString());
                isAuthenticated = authStatus;

            } catch (err) {
                console.log('WILL DESTROY SOCKET')
                socket.destroy();
            }
         
         }
         console.log('is authenticated', data.toString());
        }
    );

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err: Error) => {
        console.error('Socket error:', err.message);
    });
});


export default server;


// const server = net.createServer((socket: net.Socket) => {

//     console.log('Client connected');

//     socket.on('data', async (data: Buffer) => {
//         if(!isAuthenticated) {
//             try {
//                 const credentials = data.toString();
//                 const userCredentials = JSON.parse(credentials);
//                 await authHandshake(userCredentials.token);
//                 // if(user?.id) {
//                     isAuthenticated = true;
//                     socket.write('Authentication successful');
//                 // }
//             } catch (err) {
//            //@ts-ignore
//              console.error('Authentication error:', err.message);
//             }
//         } else {
//             socket.write('You are already authenticated');
//         }
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });

//     socket.on('error', (err: Error) => {
//         console.error('Socket error:', err.message);
//     });
// });

// export default server;




// import * as net from 'net';
// import { authHandshake } from './utils';

// let authStep = 0;




// const server = net.createServer((socket: net.Socket) => {
//     console.log('Client connected');
   


//     socket.on('data', async (data: Buffer) => {
//         console.log('auth step', authStep);
//         if(authStep === 0) {
//             const credentials = data.toString();
//             console.log('credentials', credentials);
//              const userCredentials = JSON.parse(credentials);
//              console.log('userCredentials', userCredentials);
//            const user = await authHandshake(userCredentials.token);
//            console.log('user', user);
//             authStep = 5;
//         } else {
//             console.log('you are already authenticated')
//             console.log('Received from client:', data);
//         }
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });

//     socket.on('error', (err: Error) => {
//         console.error('Socket error:', err.message);
//     });
// });


// export default server;








