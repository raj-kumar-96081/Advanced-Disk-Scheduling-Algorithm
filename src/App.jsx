import { useState ,useEffect} from 'react'
import './App.css'
import './abc.css'

const calculateFCFS = (requests, initialHead) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  for (let req of requests) {
    totalSeek += Math.abs(current - req);
    path.push(req);
    current = req;
  }
  return { totalSeek, path };
};

const calculateSSTF = (requests, initialHead) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  let remaining = [...requests];
  while (remaining.length > 0) {
    let minDistance = Infinity;
    let nextReq = null;
    let nextIndex = -1;
    for (let i = 0; i < remaining.length; i++) {
      const distance = Math.abs(current - remaining[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nextReq = remaining[i];
        nextIndex = i;
      }
    }
    totalSeek += minDistance;
    path.push(nextReq);
    current = nextReq;
    remaining.splice(nextIndex, 1);
  }
  return { totalSeek, path };
};

const calculateSCAN = (requests, initialHead, diskSize, direction) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  const sortedRequests = [...new Set(requests)].sort((a, b) => a - b);
  const left = sortedRequests.filter((req) => req <= current);
  const right = sortedRequests.filter((req) => req > current);
  if (direction === 'right') {
    for (let req of right) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
    if (right.length > 0 ||sortedRequests.length > 0) {
      totalSeek += Math.abs(current - diskSize);
      path.push(diskSize);
      current = diskSize;
    }
    for (let req of left.reverse()) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
  } else {
    for (let req of left.reverse()) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
    if (left.length > 0 || sortedRequests.length > 0) {
      totalSeek += Math.abs(current - 0);
      path.push(0);
      current = 0;
    }
    for (let req of right) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
  }
  return { totalSeek, path };
};

const calculateCSCAN = (requests, initialHead, diskSize) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  const sortedRequests = [...requests].sort((a, b) => a - b);
  const right = sortedRequests.filter((req) => req >= current);
  const left = sortedRequests.filter((req) => req < current);
  for (let req of right) {
    totalSeek += Math.abs(current - req);
    path.push(req);
    current = req;
  }
  if (right.length > 0) {
    totalSeek += Math.abs(current - diskSize);
    path.push(diskSize);
    totalSeek += diskSize;
    path.push(0);
    current = 0;
  }
  for (let req of left.concat(right)) {
    totalSeek += Math.abs(current - req);
    path.push(req);
    current = req;
  }
  return { totalSeek, path };
};

const calculateLOOK = (requests, initialHead, direction) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  const sortedRequests = [...requests].sort((a, b) => a - b);
  const left = sortedRequests.filter((req) => req <= current);
  const right = sortedRequests.filter((req) => req > current);
  if (direction === 'right') {
    for (let req of right) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
    for (let req of left.reverse()) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
  } else {
    for (let req of left.reverse()) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
    for (let req of right) {
      totalSeek += Math.abs(current - req);
      path.push(req);
      current = req;
    }
  }
  return { totalSeek, path };
};

const calculateCLOOK = (requests, initialHead) => {
  let totalSeek = 0;
  const path = [initialHead];
  let current = initialHead;
  const sortedRequests = [...requests].sort((a, b) => a - b);
  const right = sortedRequests.filter((req) => req >= current);
  const left = sortedRequests.filter((req) => req < current);
  for (let req of right) {
    totalSeek += Math.abs(current - req);
    path.push(req);
    current = req;
  }
  if (right.length > 0 && left.length > 0) {
    totalSeek += Math.abs(current - left[0]);
    path.push(left[0]);
    current = left[0];
  }
  for (let req of left.slice(1).concat(right)) {
    totalSeek += Math.abs(current - req);
    path.push(req);
    current = req;
  }
  return { totalSeek, path };
};

// function App() {
  const App=()=> {
    const [requests, setRequests] = useState([]);
    const [input, setInput] = useState('');
    const [initialHead, setInitialHead] = useState(50);
    const [diskSize, setDiskSize] = useState(200);
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [direction, setDirection] = useState('right');
    const [results, setResults] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
  
    const handleAddRequest = () => {
      const reqs = input.split(',').map((r) => parseInt(r.trim())).filter((r) => !isNaN(r) && r >= 0 && r <= diskSize);
      setRequests([...requests, ...reqs]);
      setInput('');
    };
  
    const handleSimulate = () => {
      let result;
      switch (algorithm) {
        case 'FCFS':
          result = calculateFCFS(requests, initialHead);
          break;
        case 'SSTF':
          result = calculateSSTF(requests, initialHead);
          break;
        case 'SCAN':
          result = calculateSCAN(requests, initialHead, diskSize, direction);
          break;
        case 'C-SCAN':
          result = calculateCSCAN(requests, initialHead, diskSize);
          break;
        case 'LOOK':
          result = calculateLOOK(requests, initialHead, direction);
          break;
        case 'C-LOOK':
          result = calculateCLOOK(requests, initialHead);
          break;
        default:
          result = null;
      }
      setResults(result);
      setCurrentStep(0);
    };
  
    const handleStep = () => {
      if (results && currentStep < results.path.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    };
  
    const handleReset = () => {
      setRequests([]);
      setInitialHead(50);
      setInput('');
      setResults(null);
      setCurrentStep(0);
    };
  
    const renderGraph = () => {
      if (!results) return <p className="text-gray-700 ">No simulation results yet. Click "Simulate" to start.</p>;
      const { path, totalSeek } = results;
      const height = 400;
      const width = 600;
      const points = path.map((pos, i) => ({
        x: (i / Math.max(path.length - 1, 1)) * width, // Handle single point case
        y: height - (pos / diskSize) * height,
      }));
      const averageSeekTime = path.length > 1 ? totalSeek / (path.length - 1) : 0;
      const throughput = path.length > 1 ? (requests.length / (path.length - 1)) * 100 : 0; // Hypothetical throughput as requests per 100 steps
    
      return (
        <div className="relative">
          <svg width={width+40} height={height+40} className="border-3 rounded-lg shadow-4xl mx-auto bg-gray-300 hover:scale-105 transition-transform duration-200">
            {/* X-Axis */}
            <line x1="10" y1={height} x2={width} y2={height} stroke="black" />
            <text x={width / 2} y={height + 20} textAnchor="middle" className="text-sm text-gray-700">
              Steps (0 to {Math.max(path.length - 1, 0)})
            </text>
            {/* Y-Axis */}
            <line x1="10" y1="10" x2="10" y2={height} stroke="black" />
            <text x="-40" y={height / 2} textAnchor="middle" transform="rotate(-90, -40, 200)" className="text-sm text-gray-700">
              Cylinder Number (0 to {diskSize})
            </text>
            {/* Grid Lines */}
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <line x1={i * (width / 4)} y1={height} x2={i * (width / 4)} y2={height - 5} stroke="gray" />
                <text x={i * (width / 4)} y={height + 15} textAnchor="middle" className="text-sm text-gray-500">
                  {Math.round((path.length - 1) * (i / 4))}
                </text>
                <line x1="0" y1={height - (i * (height / 4))} x2={5} y2={height - (i * (height / 4))} stroke="gray" />
                <text x="10" y={height - (i * (height / 4))} textAnchor="start" className="text-sm text-gray-500">
                  {Math.round((diskSize) * (i / 4))}
                </text>
              </g>
            ))}
            {/* Points and Lines */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={i === currentStep ? 'red' : 'green'}
              />
            ))}
            {points.length > 1 && points.slice(1).map((point, i) => (
              <line
                key={i}
                x1={points[i].x}
                y1={points[i].y}
                x2={point.x}
                y2={point.y}
                stroke="black"
                strokeWidth="3"
              />
            ))}
            {/* Cylinder Labels at Points */}
            {points.map((point, i) => (
              <text
                key={`label-${i}`}
                x={point.x+10}
                y={point.y -10}
                textAnchor="middle"
                className="text-xl text-gray-800 gap-x-[3px] px-[2px]"
              >
                {path[i]}
              </text>
            ))}
            {/* Initial Position Annotation */}
            <text
              x={points[0]?.x || 30}
              y={points[0]?.y || height}
              textAnchor="start"
              className="text-lg text-green-900"
            >
              Initial: {path[0]}
            </text>
            {/* Current Position Annotation */}
            {points.length > 0 && (
              <text
                x={points[currentStep].x}
                y={points[currentStep].y - 20}
                textAnchor="middle"
                className="text-sm text-red-600"
              >
                Current: {path[currentStep]}
              </text>
            )}
          </svg>
          {/* Legend */}
          <div className="mt-2 text-lg text-white-700 font-semibold">
            <p >Legend: <span className="text-gray-100">●</span> Past Positions | <span className="text-red-600">●</span> Current Position</p>
            <p>Total Seek Time: {totalSeek}</p>
            <p>Average Seek Time: {averageSeekTime.toFixed(2)}</p>
            <p>Throughput: {throughput.toFixed(2)} requests per 100 steps</p>
            <p>Algorithm: {algorithm}</p>
            <p>Path: {path.join(' → ')}</p>
          </div>
        </div>
      );
    };
    useEffect(() => {
      if (results) {
        const interval = setInterval(() => {
          if (currentStep < results.path.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
          } else {
            clearInterval(interval);
          }
        }, 1000); // Adjust the interval time as needed
        return () => clearInterval(interval);
      }
    }, [results, currentStep]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c9d6dd] via-[#4a5559] to-[#2a3033] p-4 sm:p-6 lg:p-8 transition-all duration-300 rounded-[30px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-4xl bg-gradient-to-br from-[#e1e5e7] via-[#c0d7e0] to-[#a2d4ec] font-bold text-center text-grey-600 mb-6 sm:mb-8 p-[8px] mx-[200px] rounded-[10px]">Advanced Disk Scheduling Simulator</h1>
      <div className="max-w-4xl bg-gradient-to-br from-[#9fd0e6] via-[#449cbb] to-[#234453] mx-auto  p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-lg font-bold text-white-700">Disk Requests (comma-separated)</label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  const reqs = e.target.value.split(',').map((r) => parseInt(r.trim())).filter((r) => !isNaN(r));
                  const isValid = reqs.every((r) => r >= 0 && r <= diskSize);
                  e.target.style.borderColor = isValid || e.target.value === '' ? '' : 'red';
                  setInput(e.target.value);
                }}
                className="mt-1 block w-full border-3 border-[white-500] rounded-md p-2 transition-colors duration-200 text-[white-500]"
                placeholder="e.g., 98,183,37,122"
              />
              {!input.split(',').every((r) => !isNaN(parseInt(r.trim())) || r.trim() === '') && (
                <span className="text-red-500 text-xs absolute -bottom-5">Invalid input</span>
              )}
            </div>
            <button
              onClick={handleAddRequest}
              className="mt-2 bg-[#39c9e2] text-white-200 px-4 py-2 rounded hover:bg-[#679699] hover:scale-110 transition-transform duration-200"
            >
              Add Requests
            </button>
          </div>
          <div>
            <label className="block text-lg font-bold text-white-700">Initial Head Position</label>
            <input
              type="number"
              value={initialHead}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                e.target.style.borderColor = val >= 0 && val <= diskSize ? '' : 'red';
                setInitialHead(val);
              }}
              className="mt-1 block w-full border-3 rounded-md p-2 transition-colors duration-200"
              min="0"
              max={diskSize}
            />
            <label className="block text-lg font-bold text-white-700 mt-2">Disk Size</label>
            <input
              type="number"
              value={diskSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                e.target.style.borderColor = val >= 100 ? '' : 'red';
                setDiskSize(val);
              }}
              className="mt-1 block w-full border-3 rounded-md p-2 transition-colors duration-200"
              min="100"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold text-white-700">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 block w-full border-3 rounded-md p-3  hover:scale-105 transition-transform duration-200"
          >
            <option value="FCFS" className="">FCFS</option>
            <option value="SSTF">SSTF</option>
            <option value="SCAN">SCAN</option>
            <option value="C-SCAN">C-SCAN</option>
            <option value="LOOK">LOOK</option>
            <option value="C-LOOK">C-LOOK</option>
          </select>
          {(algorithm === 'SCAN' || algorithm === 'LOOK') && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2 transition-colors duration-200"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleSimulate}
            className="bg-[#35d8e1] text-white px-4 py-2 rounded hover:bg-[#4d8389] hover:scale-105 transition-colors duration-200"
          >
            Simulate
          </button>
          <button
            onClick={handleStep}
            className="bg-[#43cfd6] text-white px-4 py-2 rounded hover:bg-[#4d8389] hover:scale-105 transition-colors duration-200"
            disabled={!results || currentStep >= results.path.length - 1}
          >
            Step
          </button>
          <button
            onClick={handleReset}
            className="bg-[#40ced5] text-white px-4 py-2 rounded hover:bg-[#4d8389]  hover:scale-105 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
        {requests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Current Requests: {requests.join(', ')}</h2>
          </div>
        )}
        {results && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Results</h2>
            <p className="text-lg font-semibold">Total Seek Time: {results.totalSeek}</p>
            <p className="text-lg font-semibold">Path: {results.path.slice(0, currentStep + 1).join(' → ')}</p>
            {renderGraph()}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default App;
