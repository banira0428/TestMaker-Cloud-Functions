export interface Test {
    title: string
    questions: Question[]
}

interface Question {
    question: string
    answer: string
    explanation: string
    answers: string[]
    others: string[]
    type: number
    isAutoGenerateOthers: boolean
    order: number
    isCheckOrder: boolean
    imagePath: string
}