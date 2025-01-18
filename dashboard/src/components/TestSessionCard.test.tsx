import { render, screen, fireEvent } from '@testing-library/react';
import { TestSessionCard } from './TestSessionCard';
import { TestSession } from '@/types/testSession';

describe('TestSessionCard', () => {
  const mockSession: TestSession = {
    id: 'test-1',
    name: 'Test Suite',
    status: 'passed',
    startTime: '2024-01-17T00:00:00.000Z',
    duration: 3600000, // 1 hour
    totalTests: 10,
    passedTests: 8,
    failedTests: 2,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders session information correctly', () => {
    render(<TestSessionCard session={mockSession} onClick={mockOnClick} />);

    // Check if name is displayed
    expect(screen.getByText('Test Suite')).toBeInTheDocument();

    // Check if status is displayed
    expect(screen.getByText('passed')).toBeInTheDocument();

    // Check if test counts are displayed
    expect(screen.getByText('8 passed')).toBeInTheDocument();
    expect(screen.getByText('2 failed')).toBeInTheDocument();
    expect(screen.getByText('Total: 10')).toBeInTheDocument();

    // Check if duration is displayed correctly
    expect(screen.getByText('Duration: 1h 0m')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<TestSessionCard session={mockSession} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('Test Suite'));
    
    expect(mockOnClick).toHaveBeenCalledWith('test-1');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays different status colors', () => {
    const statuses: ('passed' | 'failed' | 'running' | 'pending')[] = ['passed', 'failed', 'running', 'pending'];
    
    statuses.forEach(status => {
      const session = { ...mockSession, status };
      const { container } = render(<TestSessionCard session={session} onClick={mockOnClick} />);
      
      const statusElement = screen.getByText(status);
      expect(statusElement).toBeInTheDocument();
      
      if (status === 'passed') expect(statusElement).toHaveClass('bg-green-100');
      if (status === 'failed') expect(statusElement).toHaveClass('bg-red-100');
      if (status === 'running') expect(statusElement).toHaveClass('bg-blue-100');
      if (status === 'pending') expect(statusElement).toHaveClass('bg-gray-100');
    });
  });
}); 