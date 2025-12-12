import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompletionModal } from '../../components/CompletionModal';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('CompletionModal', () => {
    it('renders with correct title', () => {
        render(
            <CompletionModal
                correctCount={5}
                incorrectCount={2}
                totalCount={7}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Geschafft! 🎉')).toBeInTheDocument();
    });

    it('displays correct and incorrect counts', () => {
        render(
            <CompletionModal
                correctCount={8}
                incorrectCount={3}
                totalCount={11}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows percentage correctly', () => {
        render(
            <CompletionModal
                correctCount={7}
                incorrectCount={3}
                totalCount={10}
                showPercentage={true}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('calls onRestart when restart button clicked', () => {
        const handleRestart = vi.fn();

        render(
            <CompletionModal
                correctCount={5}
                incorrectCount={0}
                totalCount={5}
                onRestart={handleRestart}
            />,
            { wrapper: createWrapper() }
        );

        const restartButton = screen.getByText('Nochmal üben');
        fireEvent.click(restartButton);

        expect(handleRestart).toHaveBeenCalledTimes(1);
    });

    it('calls onBack when back button clicked', () => {
        const handleBack = vi.fn();

        render(
            <CompletionModal
                correctCount={5}
                incorrectCount={0}
                totalCount={5}
                onBack={handleBack}
            />,
            { wrapper: createWrapper() }
        );

        const backButton = screen.getByText('Zurück');
        fireEvent.click(backButton);

        expect(handleBack).toHaveBeenCalledTimes(1);
    });

    it('shows perfect message for 100%', () => {
        render(
            <CompletionModal
                correctCount={10}
                incorrectCount={0}
                totalCount={10}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Perfekt! 🌟')).toBeInTheDocument();
    });

    it('shows good message for 70%+', () => {
        render(
            <CompletionModal
                correctCount={8}
                incorrectCount={2}
                totalCount={10}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Super gemacht! 👏')).toBeInTheDocument();
    });

    it('accepts custom button labels', () => {
        render(
            <CompletionModal
                correctCount={5}
                incorrectCount={0}
                totalCount={5}
                onRestart={() => { }}
                restartLabel="Wiederholen"
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Wiederholen')).toBeInTheDocument();
    });
});
