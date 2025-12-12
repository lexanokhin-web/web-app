import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
    it('renders progress bar with correct width', () => {
        const { container } = render(<ProgressBar current={5} total={10} />);

        // Find the inner progress div by style
        const progressDiv = container.querySelector('[style*="width: 50%"]');
        expect(progressDiv).toBeTruthy();
    });

    it('shows label when showLabel is true', () => {
        render(<ProgressBar current={3} total={10} showLabel={true} />);
        expect(screen.getByText('3 / 10')).toBeInTheDocument();
    });

    it('hides label when showLabel is false (default)', () => {
        render(<ProgressBar current={5} total={10} />);
        expect(screen.queryByText('5 / 10')).not.toBeInTheDocument();
    });

    it('shows 0% width when total is 0', () => {
        const { container } = render(<ProgressBar current={0} total={0} />);
        const progressDiv = container.querySelector('[style*="width: 0%"]');
        expect(progressDiv).toBeTruthy();
    });

    it('applies different color variants', () => {
        const { container } = render(<ProgressBar current={5} total={10} color="green" />);
        // Check that green gradient class is applied
        const progressDiv = container.querySelector('.from-green-500');
        expect(progressDiv).toBeTruthy();
    });

    it('applies custom className', () => {
        const { container } = render(
            <ProgressBar current={5} total={10} className="my-custom-class" />
        );
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('my-custom-class');
    });
});
