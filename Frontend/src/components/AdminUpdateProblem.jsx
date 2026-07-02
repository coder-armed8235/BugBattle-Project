import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useParams, useNavigate,NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient'; // note: fix typo if it's axiosClient
import { CircleArrowLeft} from 'lucide-react';

// ────────────────────────────────────────────────
// Zod Schema (fixed & aligned with your form)
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum([
    'math', 'array', 'linkedList', 'graph', 'dp', 'tree', 'stack', 'queue', 'string'
  ]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
        explanation: z.string().min(1, 'Explanation is required'),
      })
    )
    .min(1, 'At least one visible test case required'),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, 'Input is required'),
        output: z.string().min(1, 'Output is required'),
      })
    )
    .min(1, 'At least one hidden test case required'),
  startCode: z
    .array(
      z.object({
        language: z.enum(['c++', 'java', 'javascript']),
        initialCode: z.string().min(1, 'Initial code is required'),
        firstCode: z.string().min(0),     // allowing empty
        lastCode: z.string().min(5, 'lastCode must be at least 5 characters'),
      })
    )
    .length(3, 'Exactly 3 language templates required'),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(['c++', 'java', 'javascript']),
        completeCode: z.string().min(1, 'Complete code is required'),
      })
    )
    .length(3, 'Exactly 3 reference solutions required'),
});



function UpdateProblem() {
  const { problemId } = useParams(); // ← get problem ID from URL
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'c++', initialCode: '', firstCode: '', lastCode: '' },
        { language: 'java', initialCode: '', firstCode: '', lastCode: '' },
        { language: 'javascript', initialCode: '', firstCode: '', lastCode: '' },
      ],
      referenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  // Fetch problem data
  useEffect(() => {
    if (!problemId ) {
      alert('Problem ID is missing');
      navigate('/admin');
      return;
    }

    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problemById/${problemId }`);
        const problem = res.data;

        // Make sure arrays are in correct order (c++, java, js)
        const sortedStartCode = ['c++', 'java', 'javascript'].map((lang) =>
          problem.startCode.find((item) => item.language === lang) || {
            language: lang,
            initialCode: '',
            firstCode: '',
            lastCode: '',
          }
        );

        const sortedRefSolutions = ['c++', 'java', 'javascript'].map((lang) =>
          problem.referenceSolution.find((item) => item.language === lang) || {
            language: lang,
            completeCode: '',
          }
        );

        reset({
          ...problem,
          startCode: sortedStartCode,
          referenceSolution: sortedRefSolutions,
          // if backend returns empty arrays → provide at least one empty item
          visibleTestCases: problem.visibleTestCases?.length ? problem.visibleTestCases : [{ input: '', output: '', explanation: '' }],
          hiddenTestCases: problem.hiddenTestCases?.length ? problem.hiddenTestCases : [{ input: '', output: '' }],
        });
      } catch (err) {
        alert('Failed to load problem: ' + (err.response?.data?.message || err.message));
        navigate('/');
      }
    };

    fetchProblem();
  }, [problemId , reset, navigate]);

  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${problemId}`, data); // or patch — depends on your API
      alert('Problem updated successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Basic Information ───────────────────────────────────── */}
        <div className="card bg-[#1a1a1a] shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          {/* title, description, difficulty, tags – same as before */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                className={`input input-bordered ${errors.title && 'input-error'}`}
              />
              {errors.title && <span className="text-error">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
              />
              {errors.description && <span className="text-error">{errors.description.message}</span>}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Tag</span></label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${errors.tags && 'select-error'}`}
                >
                  <option value="math">Math</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                  <option value="tree">Tree</option>
                  <option value="stack">Stack</option>
                  <option value="queue">Queue</option>
                  <option value="string">String</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Test Cases ──────────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

          {/* Visible Test Cases */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>

            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>

            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Code Templates ──────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>

          <div className="space-y-8">
            {['C++', 'Java', 'JavaScript'].map((lang, index) => (
              <div key={index} className="space-y-4 border-b pb-6 last:border-b-0">
                <h3 className="font-medium text-lg">{lang}</h3>

                <div className="form-control">
                  <label className="label"><span className="label-text">Initial Code</span></label>
                  <textarea
                    {...register(`startCode.${index}.initialCode`)}
                    className="textarea textarea-bordered font-mono h-40"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">First Code (optional)</span></label>
                  <textarea
                    {...register(`startCode.${index}.firstCode`)}
                    className="textarea textarea-bordered font-mono h-32"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Last Code</span></label>
                  <textarea
                    {...register(`startCode.${index}.lastCode`)}
                    className="textarea textarea-bordered font-mono h-32"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Reference Solution</span></label>
                  <textarea
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="textarea textarea-bordered font-mono h-48"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full"
        // onClick={() => handleSubmit(onSubmit)}
        >
          Update Problem
        </button>
      </form>
    </div>
  );
}

export default UpdateProblem;