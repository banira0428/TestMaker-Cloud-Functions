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

export const textToTest = functions.https.onRequest((req, res) => {
  console.log(req.body);
  const csvText = req.body.text;
  res.status(200).send(parseCSV(csvText, req.body.lang));
});

export const parseCSV = function (text: string, lang: string = "ja"): Test {
  const textRows = text.split('¥n');
  const test: Test = {
    title: 'no title',
    lang: "ja",
    questions: []
  };

  textRows.forEach((row) => {
      const textColumns = row
        .split(',')
        .filter((it: string) => it.length > 0)
        .map((it: string) => it.split('<comma>').join(',')
          .split('&lt;comma>').join(',')
          .split('\r').join('')
          .split('&lt;br>').join('\n')
          .split('<br>').join('\n'));

      if (textColumns[0] === strings.title[lang]) {
        test.title = textColumns[1];
      }

      if (textColumns[0] === strings.explanation[lang]) {
        if (test.questions.length > 0 && textColumns.length >= 2) {
          test.questions[test.questions.length - 1].explanation = textColumns[1]
        }
      }

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


      // switch (textColumns[0]) {
      //   case strings.write_problem[lang]:
      //
      //     const builder = new WriteQuestionBuilder(textColumns);
      //     if (!builder.isValidInput()) break;
      //
      //     test.questions.push(
      //       builder.setQuestion()
      //         .setAnswer()
      //         .setAnswers()
      //         .setIsAutoGenerateOthers()
      //         .setIsCheckOrder()
      //         .setOthers()
      //         .setOrder(test.questions.length)
      //         .build()
      //     );
      //
      //     break;
      //   case strings.select_problem[lang]:
      //
      //     if (textColumns.length < 4) break;
      //
      //     test.questions.push(
      //       {
      //         question: textColumns[1],
      //         answer: textColumns[2],
      //         answers: [],
      //         explanation: "",
      //         imagePath: "",
      //         isAutoGenerateOthers: false,
      //         isCheckOrder: false,
      //         order: test.questions.length,
      //         others: textColumns.slice(3, 8),
      //         type: 1,
      //       }
      //     );
      //     break;
      //   case strings.select_auto_problem[lang]:
      //
      //     if (textColumns.length < 4) break;
      //
      //     const sizeOfAutoSelectOthers = parseInt(textColumns[3], 10);
      //
      //     if (isNaN(sizeOfAutoSelectOthers)) break;
      //     if (sizeOfAutoSelectOthers > 5) break;
      //
      //     test.questions.push(
      //       {
      //         question: textColumns[1],
      //         answer: textColumns[2],
      //         answers: [],
      //         explanation: "",
      //         imagePath: "",
      //         isAutoGenerateOthers: true,
      //         isCheckOrder: false,
      //         order: test.questions.length,
      //         others: Array(sizeOfAutoSelectOthers).fill(strings.auto[lang]),
      //         type: 1,
      //       }
      //     );
      //     break;
      //   case strings.old_complete_problem[lang]:
      //   case strings.complete_problem[lang]:
      //
      //     if (textColumns.length < 4) break;
      //
      //     test.questions.push(
      //       {
      //         question: textColumns[1],
      //         answer: textColumns.slice(2, 6).join('\n'),
      //         answers: textColumns.slice(2, 6),
      //         explanation: "",
      //         imagePath: "",
      //         isAutoGenerateOthers: false,
      //         isCheckOrder: false,
      //         order: test.questions.length,
      //         others: [],
      //         type: 2,
      //       }
      //     );
      //     break;
      //   case strings.select_complete_problem[lang]:
      //
      //     if (textColumns.length < 5) break;
      //
      //     const sizeOfAnswers = parseInt(textColumns[2], 10);
      //     const sizeOfOthers = parseInt(textColumns[3], 10);
      //
      //     if (isNaN(sizeOfAnswers) || isNaN(sizeOfOthers)) break;
      //     if (sizeOfAnswers + sizeOfOthers > 6) break;
      //
      //     test.questions.push(
      //       {
      //         question: textColumns[1],
      //         answer: textColumns.slice(4, 4 + sizeOfAnswers).join('\n'),
      //         answers: textColumns.slice(4, 4 + sizeOfAnswers),
      //         explanation: "",
      //         imagePath: "",
      //         isAutoGenerateOthers: false,
      //         isCheckOrder: false,
      //         order: test.questions.length,
      //         others: textColumns.slice(4 + sizeOfAnswers, 4 + sizeOfAnswers + sizeOfOthers),
      //         type: 3,
      //       }
      //     );
      //     break;
      //
      //   case strings.select_complete_auto_problem[lang]:
      //
      //     if (textColumns.length < 3) break;
      //
      //     const sizeOfAutoSelectCompleteOthers = parseInt(textColumns[2], 10);
      //
      //     if (isNaN(sizeOfAutoSelectCompleteOthers)) break;
      //     if (sizeOfAutoSelectCompleteOthers + (textColumns.length - 3) > 6) break;
      //
      //     test.questions.push(
      //       {
      //         question: textColumns[1],
      //         answer: textColumns.slice(3, 9).join('\n'),
      //         answers: textColumns.slice(3, 9),
      //         explanation: "",
      //         imagePath: "",
      //         isAutoGenerateOthers: true,
      //         isCheckOrder: false,
      //         order: test.questions.length,
      //         others: Array(sizeOfAutoSelectCompleteOthers).fill(strings.auto[lang]),
      //         type: 3,
      //       }
      //     );
      //     break;
      //
      // }
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