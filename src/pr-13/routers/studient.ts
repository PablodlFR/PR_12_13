import * as express from 'express';
import { Studient } from '../models/studient';
import { Subject } from '../models/subjects';

export const studientRouter = express.Router();

studientRouter.post('/', async (req, res) => {
  const studient = new Studient(req.body);

  try {
    await studient.save();
    return res.status(201).send(studient);
  } catch (error) {
    return res.status(500).send(error);
  }
});

studientRouter.get('/',  async (req, res) => {
  const filter = req.query.email?{email: req.query.email.toString()}:{};

  try {
    const studients = await Studient.find(filter);

    if (studients.length !== 0) {
      return res.send(studients);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

studientRouter.patch('/', async (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({
      error: 'A studient email must be provided',
    });
  } 

  const allowedUpdates = ['name', 'surname', 'age', 'email'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const studient = await Studient.findOneAndUpdate({
      email: req.query.email.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (studient) {
      return res.send(studient);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

studientRouter.delete('/', async (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({
      error: 'A studient email must be provided',
    });
  }
  try {
    const studient = await Studient.findOneAndDelete({
      email: req.query.email.toString(),
    });
    
    if (!studient) {
      return res.status(404).send();
    } else {
      res.send(studient);
    }

    // Cuando se elimina un estudiante, también lo hace de la asignatura.
    const studientSubject = await Subject.find({
      studients: studient._id
    });
        
    studientSubject.forEach(async (item) => {
      const index = item.studients.indexOf(studient._id);
    
      if (index > -1) {
        item.studients.splice(index, 1);
        await item.save();
      }      
    });

    } catch (error) {
      return res.status(500).send(error);
    }  
});