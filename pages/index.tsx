const IndexPage = () => (
  <div className="m-auto max-w-7xl">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 ml-2 mt-40">
    <div className="flex flex-col gap-16 col-span-3">
      <h1 className="font-mono text-4xl text-white font-medium">Create and share programming quizzes</h1>
      <h2 className="font-mono text-xl text-white font-medium">Share free interactive programming quizzes with your audience!</h2>
      <button className="gradient-cta rounded-xl w-48 py-4 px-8 font-medium text-white hover:scale-105 disabled:hover:scale-100 transition disabled:opacity-50">Create a Quiz</button>
    </div>
    <div className="flex flex-col gap-2 col-span-2">
      <h3 className="text-white">Quiz</h3>
      <p className="text-sm text-white">Complete the quiz below! 🎉</p>
    </div>
  </div>
  </div>
);

export default IndexPage;
