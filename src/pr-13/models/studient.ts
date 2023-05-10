import { Document, model, Schema } from 'mongoose';
import * as validator from 'validator';

export interface StudientDocumentInterface extends Document {
  name: string,
  surname: string,
  age: number,
  email: string
}

export const StudientSchema = new Schema<StudientDocumentInterface>({
  name: {
    type: String,
    required: true,    
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Track name must start with a capital letter');
      } 
    }
  },
  surname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false,
    default: 0,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Age must be greater than 0');
      }
    }    
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.default.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  }
});

export const Studient = model<StudientDocumentInterface>('Studient', StudientSchema);