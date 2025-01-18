import { TestSession } from '@/types/testSession';

interface TestSessionCardProps {
  session: TestSession;
  onClick: (id: string) => void;
}

export function TestSessionCard({ session, onClick }: TestSessionCardProps) {
  const statusColors = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    running: 'bg-blue-100 text-blue-800',
    pending: 'bg-gray-100 text-gray-800',
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => onClick(session.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{session.name}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[session.status]}`}>
          {session.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        <div>Started: {new Date(session.startTime).toLocaleString()}</div>
        <div>Duration: {formatDuration(session.duration)}</div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-green-600">{session.passedTests} passed</span>
          {session.failedTests > 0 && (
            <span className="text-red-600 ml-2">{session.failedTests} failed</span>
          )}
        </div>
        <div className="text-gray-600">
          Total: {session.totalTests}
        </div>
      </div>
    </div>
  );
} 