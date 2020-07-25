import * as functions from "firebase-functions";
import {Test} from "./Interfaces";
import {strings} from "./strings";
import {WriteQuestionBuilder} from "./writeQuestionBuilder";
import {QuestionBuilder} from "./questionBuilder";
import {SelectQuestionBuilder} from "./selectQuestionBuilder";
import {SelectAutoQuestionBuilder} from "./selectAutoQuestionBuilder";
import {CompleteQuestionBuilder} from "./completeQuestionBuilder";
import {SelectCompleteQuestionBuilder} from "./selectCompleteQuestionBuilder";
import {SelectCompleteAutoQuestionBuilder} from "./selectCompleteAutoQuestionBuilder";
import {SelectCompleteOrderQuestionBuilder} from "./selectCompleteOrderQuestionBuilder";
import {SelectCompleteAutoOrderQuestionBuilder} from "./selectCompleteOrderAutoQuestionBuilder";
import {CompleteOrderQuestionBuilder} from "./completeOrderQuestionBuilder";

export const textToTest = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const csvText = req.body.text;
  res.status(200).send(parseCSV(csvText, req.body.title, req.body.lang));
});

export const parseCSV = function (text: string, title: string = 'no title', lang: string = "ja"): Test {
  const textRows = text.split('¥n');
  const test: Test = {
    title: title,
    lang: "ja",
    questions: []
  };

  textRows.forEach((row) => {
      const textColumns = row
        .split('\r').join('')
        .split(',')
        .filter((it: string) => it.length > 0)
        .map((it: string) => it.split('<comma>').join(',')
          .split('&lt;comma>').join(',')
          .split('&lt;br>').join('\n')
          .split('<br>').join('\n'));

      if (textColumns[0] === strings.title[lang]) {
        test.title = textColumns[1];
      } else if (textColumns[0] === strings.explanation[lang]) {
        if (test.questions.length > 0 && textColumns.length >= 2) {
          test.questions[test.questions.length - 1].explanation = textColumns[1]
        }
      } else {
        const builder = initQuestionBuilder(textColumns, lang);
        if (builder.isValidInput()) {
          test.questions.push(
            builder.setQuestion()
              .setAnswer()
              .setAnswers()
              .setIsAutoGenerateOthers()
              .setIsCheckOrder()
              .setOthers(lang)
              .setOrder(test.questions.length)
              .build()
          );
        }
      }
    }
  );
  return test
};

function initQuestionBuilder(textColumns: string[], lang: string): QuestionBuilder {
  switch (textColumns[0]) {
    case strings.write_problem[lang]:
      return new WriteQuestionBuilder(textColumns);
    case strings.select_problem[lang]:
      return new SelectQuestionBuilder(textColumns);
    case strings.select_auto_problem[lang]:
      return new SelectAutoQuestionBuilder(textColumns);
    case strings.old_complete_problem[lang]:
    case strings.complete_problem[lang]:
      return new CompleteQuestionBuilder(textColumns);
    case strings.complete_order_problem[lang]:
      return new CompleteOrderQuestionBuilder(textColumns);
    case strings.select_complete_problem[lang]:
      return new SelectCompleteQuestionBuilder(textColumns);
    case strings.select_complete_auto_problem[lang]:
      return new SelectCompleteAutoQuestionBuilder(textColumns);
    case strings.select_complete_order_problem[lang]:
      return new SelectCompleteOrderQuestionBuilder(textColumns);
    case strings.select_complete_order_auto_problem[lang]:
      return new SelectCompleteAutoOrderQuestionBuilder(textColumns);
  }
  return new WriteQuestionBuilder(textColumns);
}