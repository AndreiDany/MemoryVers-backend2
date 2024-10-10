
import {BiblePassage} from '../db.js';
import {Sequelize, Op} from 'sequelize';


export const insertBiblePassage = async(req, res) => {

    const book = req.body.book;
    const chapter = req.body.chapter;
    const firstVers = req.body.firstVers;
    const lastVers = req.body.lastVers;
    const index = req.body.index;
    const length = req.body.length;
    const userId = req.body.userId;

    const biblePassage = await BiblePassage.create({book, chapter, firstVers, lastVers, index, length, UserId: userId});

    res.send({id : biblePassage.id});

};
  

export const getMemorizedPassages = async(req, res) => {

    const userId = req.body.userId;

    const biblePassages = await BiblePassage.findAll({
        where: {
            UserId: userId,
            index: {
                [Op.eq]: Sequelize.literal('`BiblePassages`.`length` - 1'),
            },
          }
    });

    const biblePassagesToSend = [];

    for (let i = 0; i < biblePassages.length; i++) {

        var data = biblePassages[i].dataValues.createdAt
        data = data.toISOString().split('T')[0];

        biblePassagesToSend.push({
            book: biblePassages[i].dataValues.book,
            chapter: biblePassages[i].dataValues.chapter,
            firstVers: biblePassages[i].dataValues.firstVers,
            lastVers: biblePassages[i].dataValues.lastVers,
            data: data,
            id: biblePassages[i].dataValues.id
        });
    }
    res.send(biblePassagesToSend);
};
  

export const getUnfinishedPassages = async(req, res) => {

    const userId = req.body.userId;

    const biblePassages = await BiblePassage.findAll({
        where: {
            UserId: userId,
            index: {
                [Op.ne]: Sequelize.literal('`BiblePassages`.`length` - 1'),
            },
          }
    });

    const biblePassagesToSend = [];

    for (let i = 0; i < biblePassages.length; i++) {

        var data = biblePassages[i].dataValues.createdAt
        data = data.toISOString().split('T')[0];

        biblePassagesToSend.push({
            book: biblePassages[i].dataValues.book,
            chapter: biblePassages[i].dataValues.chapter,
            firstVers: biblePassages[i].dataValues.firstVers,
            lastVers: biblePassages[i].dataValues.lastVers,
            index: biblePassages[i].dataValues.index,
            length: biblePassages[i].dataValues.length,
            data: data,
            id: biblePassages[i].dataValues.id
        });
    }
    res.send(biblePassagesToSend);
};


export const progress = async(req, res) => {

    const id = req.body.id;
    const index = req.body.index;

    const biblePassages = await BiblePassage.update(
        {
            index : index,
        },
        {where: {id} }
    );

    res.send({id: biblePassages.id});

};