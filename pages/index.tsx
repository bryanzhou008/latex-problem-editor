import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function Home() {
  const [sourceProblem, setSourceProblem] = useState('');
  const [editableProblem, setEditableProblem] = useState('');
  const [renderedSource, setRenderedSource] = useState('');
  const [renderedEditable, setRenderedEditable] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    renderLatex(sourceProblem, setRenderedSource);
    renderLatex(editableProblem, setRenderedEditable);
  }, [sourceProblem, editableProblem]);

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/problems');
      const data = await response.json();
      setSourceProblem(data.source_problem);
      setEditableProblem(data.editable_problem);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const renderLatex = (latex: string, setRendered: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const rendered = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      setRendered(rendered);
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      setRendered('Error rendering LaTeX');
    }
  };

  const handleEditableChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableProblem(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ editableProblem }),
      });
      if (response.ok) {
        alert('Problem saved successfully!');
      } else {
        throw new Error('Failed to save problem');
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      alert('Failed to save problem. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>LaTeX Problem Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">LaTeX Problem Editor</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sourceProblem">
                    Source Problem (Not Editable)
                  </label>
                  <textarea
                    id="sourceProblem"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={sourceProblem}
                    readOnly
                    rows={4}
                  />
                  <div className="mt-2 p-2 bg-gray-100 rounded" dangerouslySetInnerHTML={{ __html: renderedSource }} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editableProblem">
                    Editable Problem
                  </label>
                  <textarea
                    id="editableProblem"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={editableProblem}
                    onChange={handleEditableChange}
                    rows={4}
                  />
                  <div className="mt-2 p-2 bg-gray-100 rounded" dangerouslySetInnerHTML={{ __html: renderedEditable }} />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSave}
                  >
                    Save Edited Problem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}