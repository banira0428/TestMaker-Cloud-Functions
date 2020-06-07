import {QuestionBuilder} from "./questionBuilder";

export class WriteQuestionBuilder extends QuestionBuilder {

  constructor(textColumns: string[]){
    super(textColumns);
    this.question.type = 0;
  }

  isValidLength(): boolean {
    return this.textColumns.length >= 3
  }

  setAnswer(): QuestionBuilder {
    this.question.answer = this.textColumns[2];
    return this;
  }

  setAnswers(): QuestionBuilder {
    return this;
  }

  setIsAutoGenerateOthers(): QuestionBuilder {
    return this;
  }

  setIsCheckOrder(): QuestionBuilder {
    return this;
  }

  setOthers(): QuestionBuilder {
    return this;
  }
}