import { Quiz } from "../types";

interface Props {
  quizzes: Quiz[];
}

export default function QuizTable({ quizzes }: Props) {
  return (
    <div className='flow-root p-4 mt-6 bg-black bg-opacity-25 border border-gray-800 rounded-md'>
      <ul role='list' className='-my-5 divide-y divide-gray-700'>
        {quizzes.map((quiz) => (
          <li key={quiz.friendly_id} className='py-5'>
            <div className='relative focus-within:ring-2 focus-within:ring-purple-500'>
              <h3 className='ml-2 font-semibold text-gray-600 text-md'>
                <a
                  href={`${process.env.NEXT_PUBLIC_HOME_URL}/q/${quiz.friendly_id}`}
                  className='hover:underline focus:outline-none'
                >
                  {/* Extend touch target to entire panel */}
                  <span className='absolute inset-0' aria-hidden='true' />
                  {quiz.friendly_id}
                </a>
              </h3>
              <p className='mt-1 ml-2 text-sm text-gray-300 line-clamp-2'>
                {quiz.description}
              </p>
              <span className='mt-4 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-opacity-10 bg-white text-gray-300'>
                {quiz.language}
              </span>
              <span className='mx-4 mt-4 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-opacity-50 bg-purple-300 text-gray-300'>
                {quiz.views} views
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
