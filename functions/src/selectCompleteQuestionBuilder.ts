import {QuestionBuilder} from "./questionBuilder";

export class SelectCompleteQuestionBuilder extends QuestionBuilder {

  sizeOfAnswers: number;
  sizeOfOthers: number;

  constructor(textColumns: string[]) {
    super(textColumns);
    this.question.type = 3;
    this.sizeOfAnswers = parseInt(textColumns[2], 10);
    this.sizeOfOthers = parseInt(textColumns[3], 10);
  }

  isValidInput(): boolean {
    if (this.textColumns.length < 5) return false;
    if (isNaN(this.sizeOfAnswers)) return false;
    if (isNaN(this.sizeOfOthers)) return false;
    if (this.sizeOfAnswers + this.sizeOfOthers > 6) return false;
    return true;
  }

  setAnswer(): QuestionBuilder {
    this.question.answer = this.textColumns.slice(4, 4 + this.sizeOfAnswers).join('\n');
    return this;
  }

  setAnswers(): QuestionBuilder {
    this.question.answers = this.textColumns.slice(4, 4 + this.sizeOfAnswers);
    return this;
  }

  setIsAutoGenerateOthers(): QuestionBuilder {
    return this;
  }

  setIsCheckOrder(): QuestionBuilder {
    return this;
  }

  setOthers(lang: string): QuestionBuilder {
    this.question.others = this.textColumns.slice(4 + this.sizeOfAnswers, 4 + this.sizeOfAnswers + this.sizeOfOthers)
    return this;
  }
}