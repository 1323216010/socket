import net from 'net'

const heartbeat = 'HEARTBEAT';
const client = new net.Socket();
client.connect(8081, '127.0.0.1', () => { });
client.on('data', (chunk) => {
    console.log(chunk)
    let content = chunk.toString();
    if (content === heartbeat) {
        console.log('收到服务端心跳：', content);
    } else {
        console.log('收到数据：', content);
    }
});

// 定时发送数据
setInterval(() => {
    console.log('发送数据', new Date().toUTCString());
    client.write(new Date().toUTCString());
}, 5000);

// 定时发送心跳包
setInterval(function () {
    client.write(heartbeat);
}, 10000);