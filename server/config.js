const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx256af4f2c0d2ea39',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx256af4f2c0d2ea39',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.qcloud.com/capi
    qcloudAppId: '1256427787',
    qcloudSecretId: 'AKIDiOZheQPSisx0sZeOXWK0YuJbieP0lfia',
    qcloudSecretKey: 'qZ8f6PXUFtMekfPyRjq3CBzc4LTjy64r',

    //腾讯优图AI
    aiAppId: '10127474',
    aiSecretId: 'AKID9B2xyvIIuQlvtgkg4yxoUyGMWXM9pKen',
    aiSecretKey: '73lXO8qX6TefifgAWlwvkOsFRRenpgLt'
}

module.exports = CONF
