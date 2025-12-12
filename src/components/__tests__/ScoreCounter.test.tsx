import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreCounter } from '../ScoreCounter';

describe('ScoreCounter', () => {
    it('renders with checkmark and X symbols', () => {
        const { container } = render(<ScoreCounter correct={5} incorrect={2} />);

        // The component renders "✓ 5" and "✗ 2" as single text nodes
        expect(container.textContent).toContain('✓');
        expect(container.textContent).toContain('5');
        expect(container.textContent).toContain('✗');
        expect(container.textContent).toContain('2');
    });

    it('renders zero values correctly', () => {
        const { container } = render(<ScoreCounter correct={0} incorrect={0} />);

        // Count occurrences of "0" in the text
        const text = container.textContent || '';
        const zeroMatches = text.match(/0/g);
        expect(zeroMatches?.length).toBe(2);
    });

    it('shows percentage when showPercentage is true', () => {
        render(<ScoreCounter correct={7} incorrect={3} showPercentage={true} />);
        expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('does not show percentage by default', () => {
        render(<ScoreCounter correct={7} incorrect={3} />);
        expect(screen.queryByText('70%')).not.toBeInTheDocument();
    });

    it('handles large numbers', () => {
        const { container } = render(<ScoreCounter correct={100} incorrect={50} />);
        expect(container.textContent).toContain('100');
        expect(container.textContent).toContain('50');
    });

    it('applies custom className', () => {
        const { container } = render(
            <ScoreCounter correct={5} incorrect={3} className="my-class" />
        );
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('my-class');
    });
});
