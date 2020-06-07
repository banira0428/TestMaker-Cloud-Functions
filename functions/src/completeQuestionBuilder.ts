import {QuestionBuilder} from "./questionBuilder";

export class CompleteQuestionBuilder extends QuestionBuilder {

  constructor(textColumns: string[]) {
    super(textColumns);
    this.question.type = 2;
  }

  isValidInput(): boolean {
    return this.textColumns.length >= 4
  }

  setAnswer(): QuestionBuilder {
    this.question.answer = this.textColumns.slice(2, 6).join('\n');
    return this;
  }

  setAnswers(): QuestionBuilder {
    this.question.answers = this.textColumns.slice(2, 6);
    return this;
  }

  setIsAutoGenerateOthers(): QuestionBuilder {
    return this;
  }

  setIsCheckOrder(): QuestionBuilder {
    return this;
  }

  setOthers(lang: string): QuestionBuilder {
    return this;
  }
}