import {QuestionBuilder} from "./questionBuilder";
import {strings} from "./strings";

export class SelectCompleteAutoOrderQuestionBuilder extends QuestionBuilder {

  sizeOfOthers: number;

  constructor(textColumns: string[]) {
    super(textColumns);
    this.question.type = 3;
    this.sizeOfOthers = parseInt(textColumns[2], 10);
  }

  isValidInput(): boolean {
    if (this.textColumns.length < 3) return false;
    if (isNaN(this.sizeOfOthers)) return false;
    if (this.sizeOfOthers + (this.textColumns.length - 3) > 6) return false;
    return true;
  }

  setAnswer(): QuestionBuilder {
    this.question.answer = this.textColumns.slice(3, 9).join('\n');
    return this;
  }

  setAnswers(): QuestionBuilder {
    this.question.answers = this.textColumns.slice(3, 9);
    return this;
  }

  setIsAutoGenerateOthers(): QuestionBuilder {
    this.question.isAutoGenerateOthers = true;
    return this;
  }

  setIsCheckOrder(): QuestionBuilder {
    this.question.isCheckOrder = true;
    return this;
  }

  setOthers(lang: string): QuestionBuilder {
    this.question.others = Array(this.sizeOfOthers).fill(strings.auto[lang]);
    return this;
  }
}