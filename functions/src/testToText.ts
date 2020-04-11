import {Test, Text, Question} from './Test'
import * as functions from "firebase-functions";
import {strings} from "./strings";

export const testToText = functions.https.onRequest((req, res) => {
    res.status(200).send(generateCSV(req.body.test, req.body.lang));
});

export const generateCSV = function (test: Test, lang: string = "ja"): Text {
    let result: string = "";
    result += strings.title[lang] + ',' + test.title + '¥n';

    test.questions.forEach((it: Question) => {
        switch (it.type) {
            case 0:
                result += strings.write_problem[lang] + ',' + it.question + ',' + it.answer + '¥n';
                break;
            case 1:
                if(it.isAutoGenerateOthers){
                    result += strings.select_auto_problem[lang] + ',' + it.question + ',' + it.answer + ',' + it.others.length + '¥n';
                }else{
                    result += strings.select_problem[lang] + ',' + it.question + ',' + it.answer + ',' + it.others.join(',') + '¥n';
                }
                break;
            case 2:
                break;
            case 3:
                break;

        }
        if(it.explanation.length > 0){
            result += strings.explanation[lang] + ',' + it.explanation + '¥n'
        }
    });

    return {text: result} as Text
};