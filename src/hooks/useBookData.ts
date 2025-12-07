import { useQuery } from '@tanstack/react-query';

export interface BookChapterSummary {
    id: string;
    title: string;
    description: string;
    file: string;
}

export interface BookChapterContent {
    id: string;
    title: string;
    description: string;
    sections: BookSection[];
}

export interface BookSection {
    id: string;
    title: string;
    content: string;
    exercises: BookExercise[];
}

export interface BookExercise {
    id: string;
    type: 'gap_fill' | 'transformation';
    instruction: string;
    items: BookExerciseItem[];
}

export interface BookExerciseItem {
    id: string;
    prompt: string;
    answer: string;
    parts?: string[];
}

const fetchBookIndex = async (): Promise<BookChapterSummary[]> => {
    const response = await fetch('/data/b1_book/index.json');
    if (!response.ok) {
        throw new Error('Failed to load book index');
    }
    return response.json();
};

const fetchChapter = async (filename: string): Promise<BookChapterContent> => {
    const response = await fetch(`/data/b1_book/${filename}`);
    if (!response.ok) {
        throw new Error(`Failed to load chapter: ${filename}`);
    }
    return response.json();
};

export function useBookIndex() {
    return useQuery({
        queryKey: ['book_index'],
        queryFn: fetchBookIndex,
    });
}

export function useBookChapter(filename: string | undefined) {
    return useQuery({
        queryKey: ['book_chapter', filename],
        queryFn: () => fetchChapter(filename!),
        enabled: !!filename,
    });
}
