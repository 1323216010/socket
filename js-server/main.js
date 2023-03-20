import net from 'net'

let clientList = [];
const heartbeat = 'HEARTBEAT';

const server = net.createServer();
server.on('connection', (client) => {
    console.log('客户端建立连接:', client.remoteAddress + ':' + client.remotePort);
    clientList.push(client);
    client.on('data', (chunk) => {
        let content = chunk.toString();
        if (content === heartbeat) {
            console.log('收到客户端发过来的一个心跳包');
        } else {
            console.log('收到客户端发过来的数据:', content);
            client.write('服务端的数据:' + new Date().toUTCString());
        }
    });
    client.on('end', () => {
        console.log('收到客户端end');
        clientList.splice(clientList.indexOf(client), 1);
    });
    client.on('error', () => {
        clientList.splice(clientList.indexOf(client), 1);
    })
});
server.listen(8081);

setInterval(broadcast, 10000); // 定时发送心跳包
function broadcast() {
    let cleanup = []
    for (let i = 0; i < clientList.length; i += 1) {
        if (clientList[i].writable) { // 先检查 sockets 是否可写
            clientList[i].write(heartbeat);
        } else {
            console.log('一个无效的客户端');
            cleanup.push(clientList[i]); // 如果不可写，收集起来剔除。剔除之前要用Socket.destroy()销毁。
            clientList[i].destroy();
        }
    }

    for (let i = 0; i < cleanup.length; i += 1) {
        console.log('删除无效的客户端:', cleanup[i].name);
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}