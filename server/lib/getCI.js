const debug = require('debug')('qcloud-sdk[ci]')
const crypto = require('crypto')
const config = require('../config.js')
const http = require('axios')

//身份证识别
function idCardIdentify(imageUrls, ciBucket, cardType) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/idcard',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      card_type: cardType,
      url_list: imageUrls
    }
  })
}

//通用印刷体识别
function ocr(imageUrl, ciBucket) {
  debug(`Ocr: ${JSON.stringify(imageUrl)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/general',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      url: imageUrl
    }
  })
}

//营业执照识别
function ocrBizlicense(imageUrl, ciBucket) {
  debug(`Ocr: ${JSON.stringify(imageUrl)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/bizlicense',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      url: imageUrl
    }
  })
}

//名片识别
function orcIdIdentify(imageUrls, ciBucket) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/businesscard',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      url_list: imageUrls
    }
  })
}

//识别图片内容信息，并以标签的形式显示
function getContent(imageUrls, ciBucket) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://service.image.myqcloud.com/v1/detection/imagetag_detect',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      url: imageUrls
    }
  })
}


/**
 * 获取签名
 */
function getSignature(fileBucket) {
  const appId = config.qcloudAppId
  const secretId = config.qcloudSecretId
  const secretKey = config.qcloudSecretKey

  /**
   * a=[appid]&b=[bucket]&k=[SecretID]&e=[expiredTime]&t=[currentTime]&r=[rand]&u=[userid]&f=[fileid]
   */
  const paramArr = [
    'a=' + appId,
    'b=' + fileBucket,
    'k=' + secretId,
    'e=' + (Math.floor(Date.now() / 1000) + 10),
    't=' + Math.floor(Date.now() / 1000),
    'r=' + Math.floor(Math.random() * 10),
    'u=' + 0
  ]

  debug(`paramArr: ${JSON.stringify(paramArr)}`)

  const signatureStr = paramArr.join('&')
  const temSignBuf = crypto.createHmac('sha1', secretKey).update(signatureStr).digest()
  const signatureBuf = Buffer.from(signatureStr)
  const signature = Buffer.concat([temSignBuf, signatureBuf]).toString('base64')

  debug(`signature: ${signature}`)

  return signature
}

module.exports = {
  idCardIdentify,
  ocr,
  ocrBizlicense,
  orcIdIdentify,
  getContent
}