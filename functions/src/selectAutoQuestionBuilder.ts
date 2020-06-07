import {QuestionBuilder} from "./questionBuilder";
import {strings} from "./strings";

export class SelectAutoQuestionBuilder extends QuestionBuilder {

  constructor(textColumns: string[]) {
    super(textColumns);
    this.question.type = 1;
  }

  isValidInput(): boolean {
    if (this.textColumns.length < 4) return false;
    if (isNaN(parseInt(this.textColumns[3], 10))) return false;
    if (parseInt(this.textColumns[3], 10) > 5) return false;
    return true;
  }

  setAnswer(): QuestionBuilder {
    this.question.answer = this.textColumns[2];
    return this;
  }

  setAnswers(): QuestionBuilder {
    return this;
  }

  setIsAutoGenerateOthers(): QuestionBuilder {
    this.question.isAutoGenerateOthers = true;
    return this;
  }

  setIsCheckOrder(): QuestionBuilder {
    return this;
  }

  setOthers(lang: string): QuestionBuilder {
    this.question.others = Array(parseInt(this.textColumns[3], 10)).fill(strings.auto[lang]);
    return this;
  }
}