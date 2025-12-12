import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
    it('renders children correctly', () => {
        render(
            <GlassCard>
                <p>Test content</p>
            </GlassCard>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <GlassCard className="custom-class">
                <p>Content</p>
            </GlassCard>
        );

        const card = container.firstChild;
        expect(card).toHaveClass('custom-class');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();

        render(
            <GlassCard onClick={handleClick}>
                <p>Clickable content</p>
            </GlassCard>
        );

        fireEvent.click(screen.getByText('Clickable content'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor-pointer class when onClick is provided', () => {
        const { container } = render(
            <GlassCard onClick={() => { }}>
                <p>Content</p>
            </GlassCard>
        );

        const card = container.firstChild;
        expect(card).toHaveClass('cursor-pointer');
    });

    it('does not have cursor-pointer without onClick', () => {
        const { container } = render(
            <GlassCard>
                <p>Content</p>
            </GlassCard>
        );

        const card = container.firstChild;
        expect(card).not.toHaveClass('cursor-pointer');
    });
});
