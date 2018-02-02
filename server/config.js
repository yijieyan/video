module.exports = {
    port: 5000,
    dbUrl: 'mongodb://localhost:27017/video',
    redis: {
        port: 6379,
        host: 'localhost'
    },
    enable: true ,  //是否开启利用多核cpu
    accessKey: '',
    secretKey: '',
    bucket: 'movies'
};