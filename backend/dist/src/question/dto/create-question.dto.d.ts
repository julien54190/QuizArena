export declare enum QuestionType {
    SIMPLE = "SIMPLE",
    MUSIQUE = "MUSIQUE",
    PHOTO = "PHOTO",
    ORDRE = "ORDRE"
}
export declare class CreateAnswerDto {
    text: string;
    isCorrect: boolean;
}
export declare class CreateQuestionDto {
    text: string;
    type?: QuestionType;
    mediaUrl?: string;
    orderItems?: string[];
    quizId: string;
    answers: CreateAnswerDto[];
}
