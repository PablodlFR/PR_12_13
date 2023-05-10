import { Document, model, Schema } from 'mongoose';
import { StudientDocumentInterface } from './studient';

export interface SubjectDocumentInterface extends Document {
  name: string,
  description: string,
  studients: StudientDocumentInterface[]
}

export const SubjectSchema = new Schema<SubjectDocumentInterface>({
  name: {
    type: String,
    required: true,    
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Track name must start with a capital letter');
      } 
    }
  },
  description: {
    type: String,
    required: false    
  },
  studients: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Studient'
  }
});

export const Subject = model<SubjectDocumentInterface>('Subject', SubjectSchema);