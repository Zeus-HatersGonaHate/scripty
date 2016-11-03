const mongoose = require('mongoose');
const Content = require('../data/models/content');

const ObjId = mongoose.Types.ObjectId;

const log = require('../helpers/log');
const send500 = require('../helpers/send500');
const send404 = require('../helpers/send404');

exports.getContent = (req, res) => {
  Content.find({}, function(err, docs) {
    if (err) {
      log.error(err);
    }
    return docs;
  }).then(function(docs) {
    res.status(200).send(docs);
  })

};

exports.getContentById = (req, res) => {
  const id = req.params.id;
  Content.find({_id: id}, function(err, doc) {
    if (err) {
      log.error(err);
    }
    return doc;
  }).then(function(doc) {
    res.status(200).send(doc);
  });
};

exports.getContentByType = (req, res) => {
  const type = req.params.type;
};

exports.createContent = (req, res) => {
  const lessonId = req.params.id;
  const {order, type, text} = req.body;

  new Content({order, type, text, lessonId})
    .save((err, doc) => {
      if (err) log.error(err);

    });
  res.status(201).send();
};

exports.updateContentById = (req, res) => {
  const id = req.params.id;
  var data = req.body;

  Content.findOneAndUpdate({_id: id}, data, {new: true}, function(err, doc) {
    if (err) {
      log.error(err)
    }
    return doc;
  });

  res.status(201).send("updated a lesson");
};

exports.deleteContentById = (req, res) => {
  const id = req.params.id;
};

exports.deleteAllContentsByLessonId = (id) => {
  Content.remove({"lessonId": id}, function(err, doc) {
    if (err) {
      log.error(err);
    }
    return doc;
  })
};



