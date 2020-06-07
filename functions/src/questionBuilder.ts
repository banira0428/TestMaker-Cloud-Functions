import {Question} from "./Interfaces";

export abstract class QuestionBuilder {

  question: Question;

  protected textColumns: string[];

  protected constructor(textColumns: string[]) {
    this.question = {
      question: "",
      answer: "",
      answers: [],
      explanation: "",
      imagePath: "",
      isAutoGenerateOthers: false,
      isCheckOrder: false,
      order: 0,
      others: [],
      type: 0,
    };

    this.textColumns = textColumns;
  }

  abstract isValidInput(): boolean;

  setQuestion(): QuestionBuilder {
    this.question.question = this.textColumns[1];
    return this;
  }

  setOrder(order: number): QuestionBuilder {
    this.question.order = order;
    return this;
  }

  abstract setAnswer(): QuestionBuilder
  abstract setAnswers(): QuestionBuilder
  abstract setIsAutoGenerateOthers(): QuestionBuilder
  abstract setIsCheckOrder(): QuestionBuilder
  abstract setOthers(lang: string): QuestionBuilder

  build(): Question {
    return this.question;
  };

}