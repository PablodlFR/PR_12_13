import * as express from 'express';
import { Subject } from '../models/subjects';

export const subjectRouter = express.Router();

subjectRouter.post('/', async (req, res) => {
  const subject = new Subject(req.body);

  try {
    await subject.save();
    await subject.populate({
      path: 'studients',
      select: ['email', 'name']
    });
    return res.status(201).send(subject);
  } catch (error) {
    return res.status(500).send(error);
  }
});

subjectRouter.get('/',  async (req, res) => {
  const filter = {};

  try {
    const subjects = await Subject.find(filter);

    if (subjects.length !== 0) {
      return res.send(subjects);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

subjectRouter.get('/:id', async (req, res) => {
  try {
    const subject = (await Subject.findById(req.params.id))
  
    if (subject) {
      await subject.populate({
        path: 'studients',
        select: ['email', 'name']
      });
      return res.send(subject);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  } 
});

subjectRouter.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).send();
    } else {
      await subject.populate({
        path: 'studients',
        select: ['email', 'name']
      });
      res.send(subject);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

subjectRouter.patch('/:id', async (req, res) => {  
  const allowedUpdates = ['name', 'description', 'studients'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (subject) {
      await subject.populate({
        path: 'studients',
        select: ['email', 'name']
      });
      return res.send(subject);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});