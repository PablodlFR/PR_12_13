import * as express from 'express';
import './mongoose'
import { studientRouter } from './routers/studient';
import { subjectRouter } from './routers/subjects';

export const app = express();
app.use(express.json());

app.use('/studients', studientRouter);
app.use('/subjects', subjectRouter);

/**
 * Show 404 error if access to a wrong path.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

app.post('*', (_, res) => {
  res.status(404).send();
});

app.patch('*', (_, res) => {
  res.status(404).send();
});

app.delete('*', (_, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000.')
})