import axiosClient from "../utils/axiosClient";
import React, { useState, useEffect, useRef } from 'react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '../components/ui/resizable';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area'; 
import { motion, AnimatePresence } from 'motion/react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useParams,NavLink, useNavigate  } from 'react-router';
import Editorial from '../components/Editorial';
import SubmissionHistory from "../components/SubmissionHistory";
import { logoutUser } from '../authSlice';
import ChatAi from '../components/ChatAi';
import { useDispatch,useSelector } from 'react-redux';
import { 
  Layout, 
  LogOut,
  LockKeyhole,
  User,
  Code2,
  Bot ,
  Terminal,
  CheckCircle2, 
  XCircle, 
  Play, 
  Send ,
  AlertTriangle,
  ChevronDown,
  ChevronUp

} from 'lucide-react';


const langMap = {
        cpp: 'c++',
        java: 'java',
        javascript: 'javascript'
};

// --- Sub-components ---

const ProblemDescription = ({Problem}) => {
  console.log(Problem)
  const difficultyColor = {
    Easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  }[Problem?.difficulty];


  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{Problem?.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={difficultyColor}>
              {Problem?.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {Problem?.tags}
            </Badge>
            
          </div>

        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, ...props }) => (
                <code className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto" {...props} />
              ),
            }}
          >
            {Problem?.description}
          </ReactMarkdown>
          <div className="space-y-2 mt-5">
                  {Problem?.visibleTestCases.map((example, index) => (
                    <div
                      key={index}
                      className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                        rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-200"
                    >
                      <div className="p-5 space-y-3 text-sm font-mono bg-white dark:bg-gray-950">
                        <div className="flex gap-4">
                          <span className="text-gray-500 dark:text-gray-400 w-14 font-semibold shrink-0">Input:</span>
                          <span className="text-gray-800 dark:text-gray-200 flex-1 break-all whitespace-pre-wrap">
                            {example.input}
                          </span>
                        </div>
                        
                        <div className="flex gap-4">
                          <span className="text-gray-500 dark:text-gray-400 w-14 font-semibold shrink-0">Output:</span>
                          <span className="text-gray-800 dark:text-gray-200 flex-1 break-all whitespace-pre-wrap">
                            {example.output}
                          </span>
                        </div>
                        
                        {example.explanation && (
                          <div className="flex gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400 w-14 font-semibold shrink-0">Explain:</span>
                            <span className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
                              {example.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
          </div>
           {
  Problem?.constraints?.length > 0 && (
    <>
      <h3 className="pt-3 pl-2 font-bold tracking-tight">
        Constraints:
      </h3>

      <div className="pl-5">
        <p>{Problem.constraints[0].inputLength}</p>
        <p>{Problem.constraints[0].inputValue}</p>
      </div>
    </>
  )
}
        </div>
      </div>
    </ScrollArea>
  );
};

const CodeEditor = ({ code, onChange, language = 'javascript' }) => {
  return (
    <div className="h-full w-full bg-[#1e1e1e] overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },

          // Suggestions OFF
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: 'off',
          parameterHints: { enabled: false },

          // Error / warning squiggles OFF
          renderValidationDecorations: 'off',

          // Hover popup OFF
          hover: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
// const Console = ({ runResult, submitResult , onToggle, isExpanded}) => {

//   const error=null;
//   const activeError = error || runResult?.error || submitResult?.error;

//   const content = activeError ? (
//     // ✅ ERROR / LIMIT EXCEEDED STATE
//     <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
//       <div className="p-4 bg-rose-500/10 rounded-full">
//         <AlertTriangle className="w-8 h-8 text-rose-500" />
//       </div>
//       <div className="w-full max-w-lg">
//         <h3 className="text-lg font-semibold text-rose-500 mb-2">Server Error</h3>
//         <pre className="text-sm text-rose-400 bg-rose-950/20 p-4 rounded-md border border-rose-500/20 whitespace-pre-wrap font-mono">
//           {activeError}
//         </pre>
//       </div>
//     </div>
//   ) : submitResult ? (
//     // ✅ SUBMIT RESULT UI
//     <div className="flex-1 overflow-auto p-4 sm:p-6 text-gray-400">
//       <div className="max-w-2xl mx-auto space-y-5">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-base sm:text-lg font-semibold text-gray-200">
//             Submission Result
//             {6+3}
//           </h2>
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-medium ${
//               submitResult?.accepted
//                 ? "bg-emerald-500/10 text-emerald-500"
//                 : "bg-rose-500/10 text-rose-500"
//             }`}
//           >
//             {submitResult?.accepted ? "Accepted 🎉" : "Failed ❌"}
//           </span>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//           <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
//             <p className="text-[10px] uppercase text-gray-500 font-semibold">
//               Runtime
//             </p>
//             <p className="text-sm font-medium mt-1 text-gray-200">
//               {submitResult?.runtime != null
//                 ? `${submitResult?.runtime.toFixed(2)} ms`
//                 : "--"}
//             </p>
//           </div>
//           <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
//             <p className="text-[10px] uppercase text-gray-500 font-semibold">
//               Memory
//             </p>
//             <p className="text-sm font-medium mt-1 text-gray-200">
//               {(submitResult?.memory / 1024).toFixed(2)} MB
//             </p>
//           </div>
//           <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
//             <p className="text-[10px] uppercase text-gray-500 font-semibold">
//               Test Cases
//             </p>
//             <p className="text-sm font-medium mt-1 text-gray-200">
//               {submitResult?.passedTestCases} / {submitResult?.totalTestCases}
//             </p>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="space-y-2">
//           <div className="flex justify-between text-xs text-gray-500">
//             <span>Progress</span>
//             <span>
//               {Math.round(
//                 (submitResult?.passedTestCases / submitResult?.totalTestCases) * 100
//               )}
//               %
//             </span>
//           </div>
//           <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
//             <div
//               className={`h-full transition-all duration-500 ${
//                 submitResult?.accepted ? "bg-emerald-500" : "bg-rose-500"
//               }`}
//               style={{
//                 width: `${
//                   (submitResult?.passedTestCases / submitResult?.totalTestCases) * 100
//                 }%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* Footer Message */}
//         <div className="text-xs text-gray-500">
//           {submitResult?.accepted
//             ? "Great job! Your solution passed all test cases."
//             : "Some test cases failed. Try optimizing your solution."}
//         </div>
//       </div>
//     </div>
//   ) : runResult ? (
//     // ✅ RUN RESULT UI
//     <div className="flex-1 overflow-y-auto min-h-0">
//       <div className="p-4">
//         {runResult?.testCases?.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-32">
//             <p className="text-sm text-rose-500">
//               No results yet. Run your code to see output.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {runResult?.testCases?.map((result, idx) => (
//               <div
//                 key={idx}
//                 className="space-y-2 border border-gray-800 bg-gray-900/20 rounded-lg p-3"
//               >
//                 {/* Header */}
//                 <div className="flex items-center justify-between border-b border-gray-800 pb-2">
//                   <div className="flex items-center gap-2">
//                     {runResult?.success ? (
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                     ) : (
//                       <XCircle className="w-4 h-4 text-rose-500" />
//                     )}
//                     <span className="text-sm font-medium text-gray-300">
//                       Case {idx + 1}
//                     </span>
//                   </div>
//                   <span
//                     className={`text-xs px-2 py-0.5 rounded-full ${
//                       runResult?.success
//                         ? "bg-emerald-500/10 text-emerald-500"
//                         : "bg-rose-500/10 text-rose-500"
//                     }`}
//                   >
//                     {runResult?.success ? "Passed" : "Failed"}
//                   </span>
//                 </div>

//                 {/* Data */}
//                 <div className="space-y-3 text-xs pt-1">
//                   <div>
//                     <p className="text-gray-500 mb-1">Input:</p>
//                     <pre className="p-2 bg-gray-950 text-gray-300 rounded font-mono overflow-x-auto">
//                       {result?.stdin}
//                     </pre>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 mb-1">Output:</p>
//                     <pre
//                       className={`p-2 rounded font-mono overflow-x-auto text-gray-300 ${
//                         runResult?.success
//                           ? "bg-gray-950"
//                           : "bg-rose-950/20 border border-rose-500/20 text-rose-200"
//                       }`}
//                     >
//                       {result?.stdout}
//                     </pre>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 mb-1">Expected:</p>
//                     <pre className="p-2 bg-gray-950 text-gray-300 rounded font-mono overflow-x-auto">
//                       {result?.expected_output}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   ) : (
//     // ✅ DEFAULT STATE
//     <div className="flex flex-1 items-center justify-center h-full text-sm text-gray-500">
//       Run or Submit your code to see results
//     </div>
//   );

//   return (
//     <div className="h-full flex flex-col bg-background min-h-0">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
//         <div className="flex items-center gap-3">
//           <Terminal className="w-4 h-4 text-muted-foreground" />
//           <span className="text-sm font-medium text-gray-300">Console</span>
//         </div>
//         <div className="flex items-center">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-6 w-6 text-muted-foreground hover:text-foreground" 
//             onClick={(e) => {
//                // prevent double toggle
//               onToggle();
//             }}
//           >
//             {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
//           </Button>
//         </div>
//       </div>
//       {/* Content */}
//       {content}
//     </div>
//   );
// };

// --- Main App Component ---

export default function App() {
  const [Problem,setProblem]=useState(null);
  const [code, setCode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [runResult,setRunResult]=useState(null);
  const [submitResult,setSubmitResult]= useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  //const [isExpanded,setIsExpanded]=useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  const consolePanelRef = useRef(null);
  let {problemId}  = useParams();


const Console = ({ runResult, submitResult , isConsoleExpanded}) => {

  const error=null;
  const activeError = error || runResult?.error || submitResult?.error;

  const content = activeError ? (
    // ✅ ERROR / LIMIT EXCEEDED STATE
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 bg-rose-500/10 rounded-full">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <div className="w-full max-w-lg">
        <h3 className="text-lg font-semibold text-rose-500 mb-2">Server Error</h3>
        <pre className="text-sm text-rose-400 bg-rose-950/20 p-4 rounded-md border border-rose-500/20 whitespace-pre-wrap font-mono">
          {activeError}
        </pre>
      </div>
    </div>
  ) : submitResult ? (
    // ✅ SUBMIT RESULT UI
    <div className="flex-1 overflow-auto p-4 sm:p-6 text-gray-400">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-200">
            Submission Result
            {6+3}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              submitResult?.accepted
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {submitResult?.accepted ? "Accepted 🎉" : "Failed ❌"}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
            <p className="text-[10px] uppercase text-gray-500 font-semibold">
              Runtime
            </p>
            <p className="text-sm font-medium mt-1 text-gray-200">
              {submitResult?.runtime != null
                ? `${submitResult?.runtime.toFixed(2)} ms`
                : "--"}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
            <p className="text-[10px] uppercase text-gray-500 font-semibold">
              Memory
            </p>
            <p className="text-sm font-medium mt-1 text-gray-200">
              {(submitResult?.memory / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
            <p className="text-[10px] uppercase text-gray-500 font-semibold">
              Test Cases
            </p>
            <p className="text-sm font-medium mt-1 text-gray-200">
              {submitResult?.passedTestCases} / {submitResult?.totalTestCases}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>
              {Math.round(
                (submitResult?.passedTestCases / submitResult?.totalTestCases) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                submitResult?.accepted ? "bg-emerald-500" : "bg-rose-500"
              }`}
              style={{
                width: `${
                  (submitResult?.passedTestCases / submitResult?.totalTestCases) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-xs text-gray-500">
          {submitResult?.accepted
            ? "Great job! Your solution passed all test cases."
            : "Some test cases failed. Try optimizing your solution."}
        </div>
      </div>
    </div>
  ) : runResult ? (
    // ✅ RUN RESULT UI
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-4">
        {runResult?.testCases?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-sm text-rose-500">
              No results yet. Run your code to see output.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {runResult?.testCases?.map((result, idx) => (
              <div
                key={idx}
                className="space-y-2 border border-gray-800 bg-gray-900/20 rounded-lg p-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                    {runResult?.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="text-sm font-medium text-gray-300">
                      Case {idx + 1}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      runResult?.success
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {runResult?.success ? "Passed" : "Failed"}
                  </span>
                </div>

                {/* Data */}
                <div className="space-y-3 text-xs pt-1">
                  <div>
                    <p className="text-gray-500 mb-1">Input:</p>
                    <pre className="p-2 bg-gray-950 text-gray-300 rounded font-mono overflow-x-auto">
                      {result?.stdin}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Output:</p>
                    <pre
                      className={`p-2 rounded font-mono overflow-x-auto text-gray-300 ${
                        runResult?.success
                          ? "bg-gray-950"
                          : "bg-rose-950/20 border border-rose-500/20 text-rose-200"
                      }`}
                    >
                      {result?.stdout}
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Expected:</p>
                    <pre className="p-2 bg-gray-950 text-gray-300 rounded font-mono overflow-x-auto">
                      {result?.expected_output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    // ✅ DEFAULT STATE
    <div className="flex flex-1 items-center justify-center h-full text-sm text-gray-500">
      Run or Submit your code to see results
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-gray-300">Console</span>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-foreground" 
            onClick={(e) => {
               // prevent double toggle
              toggleConsole();
              
            }}
          >
            {isConsoleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {/* Content */}
      {content}
    </div>
  );
};


const toggleConsole = () => {
  const panel = consolePanelRef.current;
  
  if (!panel) return;

  if (isConsoleExpanded) {
    // Collapse karo
    panel.collapse();
    setIsConsoleExpanded(false);
  } else {
    // Expand karo
    panel.expand();           // ya panel.resize(40) bhi chalega
    setIsConsoleExpanded(true);
  }
};


   useEffect(() => {
      const fetchProblem = async () => {
        try {
          const response = await axiosClient.get(`/problem/problemById/${problemId}`);
          const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
          setProblem(response.data); 
          setCode(initialCode);
        } catch (error) {
          console.error('Error fetching problem:', error);
        }
      };
      fetchProblem();
    }, [problemId]);

  useEffect(() => {
      if (Problem) {
        const initialCode = Problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        setCode(initialCode);
      }
    }, [selectedLanguage, Problem]);
  
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
      try {
        
          if (!isAuthenticated) {
          navigate('/login');
           return;
          }
        setIsRunning(true);
        setSubmitResult(null);
        const response = await axiosClient.post(`/submission/run/${problemId}`, {
          code,
          language: selectedLanguage
        });
        setRunResult(response.data);
        setIsRunning(false);
      } catch (error) {
        // console.error('Error running code:', error);
        setRunResult({
          success: false,
          error: 'Internal server error'
        });
      }
    };

const handleSubmitCode = async () => {
  setIsSubmitting(true);

  try {
     if (!isAuthenticated) {
          navigate('/login');
           return;
      }
    const response = await axiosClient.post(`/submission/submit/${problemId}`,
      {
        code,
        language: selectedLanguage,
      }
    );
    setSubmitResult(response.data);
    setRunResult(null);

  } catch (error) {
    console.log(error.response?.data?.error)
    // console.error("Error submitting code:", error);

    setSubmitResult({
      success: false,
      error: error.response?.data?.error || "Internal server Error",
    });

  } finally {
    setIsSubmitting(false);
  }
};



  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
    
  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 shrink-0 bg-muted/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <NavLink to='/home' >
            <span>BugBattle</span>
            </NavLink>
          </div>
        </div>

        {/* Middle Buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRun} 
            disabled={isRunning}
            className="h-8 gap-2 bg-background border-border hover:bg-muted cursor-pointer"
          >
            <Play className={`w-4 h-4 text-emerald-500 ${isRunning ? 'animate-pulse' : 'fill-emerald-500'}`} />
            <span className="font-semibold">{isRunning ? 'Running...' : 'Run'}</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmitCode} 
            disabled={isSubmitting}
            className="h-8 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm cursor-pointer"
          >
            <Send className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
            <span className="font-semibold">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted cursor-pointer"> </Button>
          
          {
            !isAuthenticated && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-medium ring-2 ring-gray-200">
                <button
                 onClick={() => navigate('/login')}
                className='cursor-pointer text-xs'
                >
                  login
                </button>
              </div>
            )
          }
          
          {isAuthenticated && <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="group flex items-center gap-3 rounded-full p-1.5 transition hover:bg-gray-90  focus:outline-none cursor-pointer "
              aria-expanded={isDropdownOpen}
            >
              {/* Avatar */}
              {user?.avatarUrl? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-200 transition group-hover:ring-gray-300"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white font-medium ring-2 ring-gray-200">
                  {user?.fullName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
             {isDropdownOpen && (
              <>
                {/* Backdrop click to close */}
                <div
                  className="fixed inset-0 z-40 md:hidden"
                  onClick={closeDropdown}
                />

                <div className="fixed right-2 top-12 z-9999 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-xl md:w-72">

                  {/* Menu Items */}
                  <div className="py-1">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeDropdown}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </div>

                 { user.role==='admin' && <NavLink
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeDropdown}
                    >
                      <LockKeyhole className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </NavLink>}

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={async() => {
                        try {
                            await dispatch(logoutUser());
                        } catch (error) {
                            
                        }
                        closeDropdown();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <NavLink to={'/login'}>
                         <span>Log out</span>
                      </NavLink>
                     
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>}
         
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-2 bg-muted/30">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* Left Panel: Description */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="flex items-center gap-1 px-2 py-1 border-b bg-muted/30 shrink-0">
                <Button 
                  variant={activeTab === 'description' ? "" : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs gap-2 cursor-pointer"
                  onClick={() => setActiveTab('description')}
                >
                  <Layout className="w-3.5 h-3.5" />
                  Description
                </Button>
                <Button 
                  variant={activeTab === 'solutions' ? '' : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs gap-2 cursor-pointer"
                  onClick={() => setActiveTab('solutions')}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Editorial
                </Button>
                <Button 
                  variant={activeTab === 'submissions' ? '' : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs gap-2 cursor-pointer"
                  onClick={() => setActiveTab('submissions')}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Submissions
                </Button>
                <Button 
                  variant={activeTab === 'BugBot' ? '' : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs gap-2 cursor-pointer"
                  onClick={() => setActiveTab('BugBot')}
                >
                  <Bot className="w-3.5 h-3.5" />
                  BugBot
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full"
                    >
                      <ProblemDescription Problem={Problem} />
                    </motion.div>
                  )}
                  {activeTab === 'solutions' && (
                    <motion.div
                      key="solutions"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full"
                    >
                      <Editorial 
                        secureUrl={Problem.secureUrl} 
                        thumbnailUrl={Problem.thumbnailUrl} 
                        problem={Problem} 
                        duration={Problem.duration}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'submissions' && (
                    <motion.div
                      key="submissions"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full"
                    >
                    <SubmissionHistory problemId={problemId} />

                    </motion.div>
                  )}

                  {activeTab==='BugBot' &&(
                    <motion.div
                      key="BugBot"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full"
                    >
                      <ChatAi Problem={Problem} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-transparent hover:bg-primary/5 transition-colors" />

          {/* Right Panel: Editor & Console */}
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup orientation="vertical" className="gap-0.5" >
              <ResizablePanel defaultSize={94} minSize={30}>
                <div className="h-full rounded-xl border shadow-sm overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-1 border-b bg-muted/30 shrink-0">
                    <div className="flex items-center gap-4 ">
                      <select
                        className="select select-sm bg-base-100  border-base-300/70 dark:border-gray-700 focus:border-primary/70 focus:ring-2 focus:ring-primary/20 shadow-sm "
                        value={selectedLanguage}
                        onChange={e => handleLanguageChange(e.target.value)}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                      </select>
                    </div>
                     <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium">Code Editor</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor 
                      code={code} 
                      onChange={(val) => setCode(val || '')} 
                    />
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle className="h-2 bg-transparent hover:bg-primary/5 transition-colors focus:outline-none border-none" />
              
              <ResizablePanel 
              ref={consolePanelRef} 
              defaultSize={60} 
              minSize={10} 
              collapsible={true}           // ← yeh zaroori hai
              onCollapse={() => setIsConsoleExpanded(false)}
              onExpand={() => setIsConsoleExpanded(true)}
              >
                <div className="h-full rounded-xl border shadow-sm overflow-hidden">
                  <Console 
                    runResult={runResult} 
                    submitResult={submitResult}
                    isConsoleExpanded={isConsoleExpanded}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
