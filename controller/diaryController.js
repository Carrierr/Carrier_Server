const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const { respondJson, respondOnError } = require('../utils/respond');
const { diaryModel } = require('../model');
const { getValue, setStampPosition, getStampPosition } = require('../modules/redisModule');
const { writeFile, deleteFile, createDir, createSaveFileData } = require('../modules/fileModule');
const resultCode = require('../utils/resultCode');
const { parameterFormCheck, getUrl, imagesTypeCheck, getRemainStamp, getRandomStamp } = require('../utils/common');
const { diaryRq } = require('../utils/requestForm');

const controllerName = 'Diary';

router.use((req, res, next) => {

    console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                                controllerName,
                                req.ip,
                                moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                            ));

    go(
      req.body || req.params || req.query,
      parameterFormCheck,
      f => f(diaryRq[getUrl(req.originalUrl)]),
      result => result
      ? next()
      : respondOnError(res, resultCode.incorrectParamForm, {desc: "incorrect parameter form"})
    );
});

router.post('/write', (req, res) => {
    const fileName = req.files ? req.files.diaryFile.name : false;
    const { content, location, latitude, longitude } = req.body;
    const data = {
        content: content,
        location: location,
        latitude: latitude,
        longitude: longitude
    };

    fileName
    ? go(
        null,
        createDir,
        dir => createSaveFileData(fileName, dir, req.headers['tiptap-token']),
        result => {
            data.imagePath = result.path;
            data.imageUrl = `${baseUrl}/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
            req.files.diaryFile.name = result.name;
            return req.files;
        },
        imagesTypeCheck,
        writeFile,
        fileWriteResult => fileWriteResult
        ? true
        : respondOnError(res, resultCode.error, {'desc' : 'file write fail'}),
        _ => getValue(req.headers['tiptap-token']),
        session => {
            data.user_id = session.key;
            return data;
        },
        insertData => diaryModel.create(insertData).catch(e => respondOnError(res, resultCode.error, e.message)),
        _ => req.headers['tiptap-token'],
        getStampPosition,
        arr => getRemainStamp(arr || []),
        getRandomStamp,
        stamp => setStampPosition(req.headers['tiptap-token'], stamp),
        _ => respondJson(res, resultCode.success, { desc: 'completed write diary' })
    )
    : go(
        req.headers['tiptap-token'],
        getValue,
        session => {
            data.user_id = session.key;
            return data;
        },
        insertData => diaryModel.create(insertData).catch(e => respondOnError(res, resultCode.error, e.message)),
        _ => req.headers['tiptap-token'],
        getStampPosition,
        arr => getRemainStamp(arr || []),
        getRandomStamp,
        stamp => setStampPosition(req.headers['tiptap-token'], stamp),
        _ => respondJson(res, resultCode.success, { desc: 'completed write diary' })
    );
});

router.get('/list', (req, res) => {
    const options = {};

    go(
        req.headers['tiptap-token'],
        getValue,
        result => result
            ? ((key) => { options.where = { user_id: key }; return options; })(result.key)
            : respondOnError(res, resultCode.error, { desc: 'unknown token' }),
        options => diaryModel.findAll(options).catch(e => respondOnError(res, resultCode.error, e.message)),
        result => respondJson(res, resultCode.success, { list: result })
    );
});

router.get('/today', (req, res) => {
    const options = {};
    let respondStamp = [];

    go(
        req.headers['tiptap-token'],
        getValue,
        result => result
            ? ((obj) => { respondStamp = obj.stamp; options.where = { user_id: obj.key }; return options; })(result)
            : respondOnError(res, resultCode.error, { desc: 'unknown token' }),
        options => diaryModel.findToday(options).catch(e => respondOnError(res, resultCode.error, e.message)),
        result => respondJson(res, resultCode.success, { list: result, stamp: respondStamp })
    );
});

router.post('/update', (req, res) => {
    const fileName = req.files ? req.files.diaryFile.name : false;
    const { content, location, latitude, longitude, id } = req.body;
    const options = {
        data: {
            content: content,
            location: location,
            latitude: latitude,
            longitude: longitude
        },
        where: {
            id: id
        }
    };

    fileName
    ? go(
        id,
        target => diaryModel.findDeleteTarget({ where: { id: target } }).catch(e => respondOnError(res, resultCode.error, e.message)),
        deleteTarget => deleteFile(deleteTarget.imagePath),
        createDir,
        dir => createSaveFileData(fileName, dir, req.headers['tiptap-token']),
        result => {
            options.data.imagePath = result.path;
            options.data.imageUrl = `${baseUrl}/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
            req.files.diaryFile.name = result.name;
            return req.files;
        },
        imagesTypeCheck,
        writeFile,
        fileWriteResult => fileWriteResult
        ? true
        : respondOnError(res, resultCode.error, {'desc' : 'file write fail'}),
        _ => getValue(req.headers['tiptap-token']),
        session => {
            options.where.user_id = session.key;
            return options;
        },
        updateData => diaryModel.update(updateData).catch(e => respondOnError(res, resultCode.error, e.message)),
        _ => respondJson(res, resultCode.success, { desc: 'completed update diary' })
    )
    : go(
        req.headers['tiptap-token'],
        getValue,
        session => {
            options.where.user_id = session.key;
            return options;
        },
        updateData => diaryModel.update(updateData).catch(e => respondOnError(res, resultCode.error, e.message)),
        _ => respondJson(res, resultCode.success, { desc: 'completed update diary' })
    );
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    const options = {
        where: {
            id: id
        }
    };

    go(
        null,
        _ => diaryModel.delete(options).catch(e => respondOnError(res, resultCode.error, e.message)),
        _ => respondJson(res, resultCode.success, { desc: 'completed delete diary' })
    );
});

router.get('/today/sample/by/jo', async (req, res) => {
  try {
    const { key: user_id, stamp } = await go(
      req.headers['tiptap-token'],
      getValue) || {};

    !user_id
      ? respondOnError(res, resultCode.error, { desc: 'unknown token' })
      : go(
        diaryModel.findToday({ where: { user_id } }).exec(),
        list => respondJson(res, resultCode.success, { list, stamp }))

  } catch (error) {
    respondOnError(res, resultCode.error, error.message);
  }
});

module.exports = router;
