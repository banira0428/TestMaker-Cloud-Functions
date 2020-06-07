import {QuestionBuilder} from "./questionBuilder";

export class SelectQuestionBuilder extends QuestionBuilder {

  constructor(textColumns: string[]){
    super(textColumns);
    this.question.type = 1;
  }

  isValidLength(): boolean {
    return this.textColumns.length >= 4
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
    this.question.others = this.textColumns.slice(3, 8);
    return this;
  }
}