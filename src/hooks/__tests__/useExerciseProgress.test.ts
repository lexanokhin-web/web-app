import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExerciseProgress } from '../useExerciseProgress';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get store() { return store; }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

describe('useExerciseProgress', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('returns default progress when no blockId provided', () => {
        const { result } = renderHook(() => useExerciseProgress(undefined));

        expect(result.current.progress).toEqual({
            learnedWordIDs: [],
            toRepeatWordIDs: [],
            totalCompleted: 0
        });
    });

    it('loads saved progress from localStorage', () => {
        const savedProgress = {
            learnedWordIDs: ['word1', 'word2'],
            toRepeatWordIDs: ['word3'],
            totalCompleted: 5
        };
        localStorageMock.setItem('userProgress_test-block', JSON.stringify(savedProgress));

        const { result } = renderHook(() => useExerciseProgress('test-block'));

        expect(result.current.progress).toEqual(savedProgress);
    });

    it('saves progress to localStorage', () => {
        const { result } = renderHook(() => useExerciseProgress('my-block'));

        const newProgress = {
            learnedWordIDs: ['word1'],
            toRepeatWordIDs: [],
            totalCompleted: 1
        };

        act(() => {
            result.current.saveProgress(newProgress);
        });

        expect(result.current.progress).toEqual(newProgress);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'userProgress_my-block',
            JSON.stringify(newProgress)
        );
    });

    it('updates progress correctly', () => {
        const { result } = renderHook(() => useExerciseProgress('block-1'));

        act(() => {
            result.current.saveProgress({
                learnedWordIDs: ['a', 'b'],
                toRepeatWordIDs: ['c'],
                totalCompleted: 3
            });
        });

        expect(result.current.progress.learnedWordIDs).toHaveLength(2);
        expect(result.current.progress.totalCompleted).toBe(3);
    });

    it('handles invalid JSON gracefully', () => {
        // Manually set invalid JSON
        window.localStorage.setItem('userProgress_bad-block', 'not-valid-json');

        const { result } = renderHook(() => useExerciseProgress('bad-block'));

        // Should return default progress without crashing
        expect(result.current.progress).toBeDefined();
    });
});
