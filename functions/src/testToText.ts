import {Test, Text, Question} from './Interfaces'
import * as functions from "firebase-functions";
import {strings} from "./strings";

export const testToText = functions.https.onRequest((req, res) => {
    console.log(req.body);
    res.status(200).send(generateCSV(req.body));
});

export const generateCSV = function (test: Test): Text {
    const lang: string = test.lang;
    let result: string = "";
    result += strings.title[lang] + ',' + test.title + '\n';

    test.questions.forEach((it: Question) => {
        switch (it.type) {
            case 0:
                result += strings.write_problem[lang] + ',' + escape(it.question) + ',' + it.answer + '\n';
                break;
            case 1:
                if(it.isAutoGenerateOthers){
                    result += strings.select_auto_problem[lang] + ',' + escape(it.question) + ',' + escape(it.answer) + ',' + it.others.length + '\n';
                }else{
                    result += strings.select_problem[lang] + ',' + escape(it.question) + ',' + escape(it.answer) + ',' + it.others.map(escape).join(',') + '\n';
                }
                break;
            case 2:
                result += strings.complete_problem[lang] + ',' + escape(it.question) + ',' + it.answers.join(',') + '\n';
                break;
            case 3:
                if(it.isAutoGenerateOthers){
                    result += strings.select_complete_auto_problem[lang] + ',' + escape(it.question) + ',' + it.others.length + ',' + it.answers.map(escape).join(',') + '\n';
                }else{
                    result += strings.select_complete_problem[lang] + ',' + escape(it.question) + ',' + it.answers.length + ',' + it.others.length + ',' + it.answers.map(escape).join(',') + ',' + it.others.map(escape).join(',') +'\n';
                }
                break;

        }
        if(it.explanation.length > 0){
            result += strings.explanation[lang] + ',' + it.explanation + '\n'
        }
    });

    return {text: result} as Text
};

function escape(text: string): string {
    return text.split('¥n').join('&lt;br>').split(',').join('&lt;comma>');
}