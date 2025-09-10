export declare enum Difficulty {
    FACILE = "FACILE",
    MOYEN = "MOYEN",
    DIFFICILE = "DIFFICILE"
}
export declare class CreateQuizDto {
    title: string;
    description: string;
    categoryId: string;
    difficulty: Difficulty;
    isPublic?: boolean;
    allowComments?: boolean;
}
