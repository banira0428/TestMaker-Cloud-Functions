export const strings = {
    title: {
        ja: "タイトル",
        en: "title",
    } as LocalizedString,
    write_problem: {
        ja: "記述",
        en: "short problem"
    } as LocalizedString,
    select_problem: {
        ja: "選択",
        en: "selection problem"
    } as LocalizedString,
    old_complete_problem: {
        ja: "記述A",
        en: "multiple answers"
    } as LocalizedString,
    complete_problem: {
        ja: "完答",
        en: "multiple answers"
    } as LocalizedString,
    select_complete_problem: {
        ja: "選択完答",
        en: "selection complete problem"
    } as LocalizedString,
    select_complete_order_problem: {
        ja: "選択完答O",
        en: "selection complete order problem"
    } as LocalizedString,
    select_auto_problem: {
        ja: "選択A",
        en: "selection auto problem"
    } as LocalizedString,
    select_complete_auto_problem: {
        ja: "選択完答A",
        en: "selection complete auto problem"
    } as LocalizedString,
    select_complete_order_auto_problem: {
        ja: "選択完答AO",
        en: "selection complete order auto problem"
    } as LocalizedString,
    explanation: {
        ja: "解説",
        en: "explanation"
    } as LocalizedString,
    auto: {
        ja: "自動生成",
        en: "auto"
    } as LocalizedString,
};

interface LocalizedString {
    ja: string
    en: string
    [key: string]: string //string型がvalueに入っていることを明示する
}