import { useQuery } from '@tanstack/react-query';

export interface BookExerciseItem {
    id: string;
    prompt: string;
    answer: string;
    grammarNote?: string;
}

export interface BookExercise {
    id: string;
    type: 'transformation' | 'fill-in' | 'multiple-choice'; // added multiple-choice just in case
    instruction: string;
    items: BookExerciseItem[];
}

export interface BookSection {
    id: string;
    title: string;
    content: string;
    exercises: BookExercise[];
}

export interface BookChapterContent {
    id: string;
    title: string;
    description: string;
    sections: BookSection[];
}


export interface BookChapter {
    id: string;
    title: string;
    description: string;
    file: string;
}

export function useA2BookData() {
    const { data: chapters, isLoading } = useQuery({
        queryKey: ['a2-book-index'],
        queryFn: async () => {
            const res = await fetch('/data/a2_book/index.json');
            if (!res.ok) throw new Error('Failed to load book index');
            return res.json() as Promise<BookChapter[]>;
        }
    });

    const fetchChapter = async (filename: string) => {
        const res = await fetch(`/data/a2_book/${filename}`);
        if (!res.ok) throw new Error('Failed to load chapter');
        return res.json() as Promise<BookChapterContent>;
    };


    return {
        chapters,
        isLoading,
        fetchChapter
    };
}
