const { uploader } = require('../qcloud')
const getCi = require('../lib/getCI.js')
const https = require('https');
const fs = require('fs');

module.exports = async ctx => {
  const data = await uploader(ctx.req)

  if (ctx.query.action && ctx.query.action === 'idcard') {//身份证识别
    const { data: identifyResult } = await getCi.idCardIdentify([data.imgUrl], 'ci', 0)
    ctx.state.data = identifyResult.result_list
  } else if (ctx.query.action && ctx.query.action === 'general') {//通用印刷体识别
    const { data: ocrResult } = await getCi.ocr(data.imgUrl, 'ci')
    ctx.state.data = ocrResult
  } else if (ctx.query.action && ctx.query.action === 'busCard') {//营业执照识别
    const { data: pornResult } = await getCi.ocrBizlicense(data.imgUrl, 'ci')
    ctx.state.data = pornResult
  } else if (ctx.query.action && ctx.query.action === 'idName') {//名片识别
    const { data: idResult } = await getCi.orcIdIdentify(data.imgUrl, 'ci')
    ctx.state.data = idResult.result_list
  } else if (ctx.query.action && ctx.query.action === 'idContent') {//识别图片内容信息
    const { data: conResult } = await getCi.getContent(data.imgUrl, 'ci')
    ctx.state.data = conResult
  } 
}